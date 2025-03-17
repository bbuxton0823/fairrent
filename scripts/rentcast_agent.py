#!/usr/bin/env python3
import os
import sys
import json
import requests
import math
import re
from dotenv import load_dotenv
from urllib.parse import quote
from datetime import datetime, timedelta
import logging

# Set up logging
log_dir = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 
    'logs'
)
log_file = os.path.join(log_dir, 'rentcast_agent.log')
os.makedirs(os.path.dirname(log_file), exist_ok=True)
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(log_file),
        logging.StreamHandler(sys.stderr)
    ]
)
logger = logging.getLogger('rentcast_agent')

# Try to load environment variables from .env files
try:
    load_dotenv()
    load_dotenv(".env.local")
except Exception as e:
    logger.error(f"Could not load environment variables: {str(e)}")

def calculate_distance(lat1, lon1, lat2, lon2):
    """
    Calculate the distance between two points using the Haversine formula.
    Returns distance in miles.
    """
    # Convert latitude and longitude from degrees to radians
    lat1_rad = math.radians(lat1)
    lon1_rad = math.radians(lon1)
    lat2_rad = math.radians(lat2)
    lon2_rad = math.radians(lon2)
    
    # Haversine formula
    dlon = lon2_rad - lon1_rad
    dlat = lat2_rad - lat1_rad
    a = math.sin(dlat/2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlon/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    
    # Earth radius in miles
    radius = 3959
    
    # Calculate distance
    distance = radius * c
    
    return round(distance, 1)

def search_zillow_rentals(property_details):
    """
    Search Zillow for rental properties based on the provided details.
    Returns a list of comparable properties.
    """
    try:
        # Extract property details
        zip_code = property_details.get("zipCode", "")
        beds = property_details.get("beds", "")
        baths = property_details.get("baths", "")
        
        # Get RapidAPI key from environment
        api_key = os.environ.get("RAPIDAPI_KEY")
        
        if not api_key:
            print("Warning: No RapidAPI key found for Zillow search.", file=sys.stderr)
            return []
        
        # Prepare the API request
        url = "https://zillow-com1.p.rapidapi.com/propertyExtendedSearch"
        headers = {
            "X-RapidAPI-Key": api_key,
            "X-RapidAPI-Host": "zillow-com1.p.rapidapi.com"
        }
        
        # Build the query parameters
        params = {
            "location": zip_code,
            "home_type": "Houses",
            "isRentalOnly": "true"
        }
        
        print(f"DEBUG: Making Zillow API request with params: {params}", file=sys.stderr)
        
        # Make the API request
        response = requests.get(url, headers=headers, params=params)
        
        # Check if the request was successful
        if response.status_code == 200:
            data = response.json()
            print(f"DEBUG: Zillow API response: {json.dumps(data)[:500]}...", file=sys.stderr)
            
            # Extract properties from the response
            properties = data.get("props", [])
            
            if properties:
                formatted_comps = []
                
                # Get the subject property coordinates
                subject_lat = property_details.get("latitude")
                subject_lon = property_details.get("longitude")
                
                for prop in properties[:3]:  # Limit to 3 comparables
                    # Calculate distance if coordinates are available
                    distance = 0
                    if subject_lat and subject_lon and prop.get("latitude") and prop.get("longitude"):
                        distance = calculate_distance(
                            subject_lat, subject_lon,
                            prop.get("latitude"), prop.get("longitude")
                        )
                    
                    # Extract rent
                    rent = prop.get("price", 0)
                    if isinstance(rent, str):
                        # Remove non-numeric characters and convert to float
                        rent = float(re.sub(r'[^\d.]', '', rent)) if re.sub(r'[^\d.]', '', rent) else 0
                    
                    formatted_comp = {
                        "address": prop.get("address", "Unknown"),
                        "beds": prop.get("bedrooms", 0),
                        "baths": prop.get("bathrooms", 0),
                        "sqft": prop.get("livingArea", 0),
                        "rent": rent,
                        "yearBuilt": prop.get("yearBuilt", "Unknown"),
                        "distance": distance,
                        "amenities": [],
                        "propertyType": prop.get("homeType", "Unknown"),
                        "source": "Zillow",
                        "url": f"https://www.zillow.com/homedetails/{prop.get('zpid')}_zpid/"
                    }
                    formatted_comps.append(formatted_comp)
                
                return formatted_comps
        else:
            print(f"DEBUG: Zillow API response status code: {response.status_code}", file=sys.stderr)
            print(f"DEBUG: Zillow API response text: {response.text}", file=sys.stderr)
        
        return []
    
    except Exception as e:
        print(f"Error searching Zillow: {str(e)}", file=sys.stderr)
        return []

def find_comparable_properties(property_details):
    """
    Find comparable rental properties using the Rentcast API and Zillow.
    Falls back to mock data if the API calls fail.
    """
    # Get API key from input data or environment
    api_key = property_details.get("rentcastApiKey") or os.environ.get("RENTCAST_API_KEY")
    
    # Clean the API key to remove any trailing whitespace or special characters
    if api_key:
        api_key = api_key.strip()
        logger.info(f"Using Rentcast API key: {api_key[:5]}...{api_key[-5:]}")
    else:
        logger.error("No Rentcast API key found")
        return generate_mock_comparables(property_details)
    
    # Initialize list to store all comparables
    all_comparables = []
    
    # Get the subject property coordinates
    subject_lat = property_details.get("latitude")
    subject_lon = property_details.get("longitude")
    
    # If coordinates aren't provided, try to geocode the address
    if not subject_lat or not subject_lon:
        logger.warning("No coordinates found in property details, attempting to geocode")
        location_data = geocode_address(property_details)
        if location_data:
            subject_lat = location_data.get("latitude")
            subject_lon = location_data.get("longitude")
            # Update the property details with the geocoded data
            property_details.update(location_data)
        else:
            logger.error("Failed to geocode property address")
            # Continue with analysis but note the error
            property_details["geocoding_error"] = True
    
    # Log the coordinates we're using
    logger.info(f"Using coordinates: {subject_lat}, {subject_lon}")
    
    # Get the zip code and other location data
    zip_code = property_details.get("zip_code") or property_details.get("zipCode")
    city = property_details.get("city", "")
    state = property_details.get("state", "")
    
    logger.info(f"Location data: ZIP={zip_code}, City={city}, State={state}")
    
    # Try to get comparables from Rentcast API
    try:
        # Extract property details
        beds = property_details.get("beds", "")
        baths = property_details.get("baths", "")
        property_type = property_details.get("propertyType", "")
        
        # Prepare the API request
        url = "https://api.rentcast.io/v1/properties"
        headers = {
            "X-API-KEY": api_key,
            "Content-Type": "application/json"
        }
        
        # Build the query parameters - prioritize using location data
        params = {}
        
        # First try to use zip code
        if zip_code:
            params["zipCode"] = zip_code
        # If no zip code, try city and state
        elif city and state:
            params["city"] = city
            params["state"] = state
        # If only city is available, use it (state might be inferred)
        elif city:
            params["city"] = city
        
        # Add property details to the query
        if beds:
            params["bedrooms"] = beds
        if baths:
            params["bathrooms"] = baths
        if property_type:
            params["propertyType"] = property_type
        
        logger.info(f"Making API request to {url} with params: {params}")
        
        # Make the API request
        response = requests.get(url, headers=headers, params=params)
        
        # Check if the request was successful
        if response.status_code == 200:
            # The API returns an array of properties directly
            properties = response.json()
            logger.debug(f"API response: {json.dumps(properties)[:500]}...")
            
            # Check if properties is a list with items
            if isinstance(properties, list) and properties:
                logger.info(f"Found {len(properties)} properties from Rentcast API")
                
                # Process the properties to create comparable objects
                comparable_count = 0
                for prop in properties:
                    # Calculate rent if rentZestimate is not available
                    rent = 0
                    if "rentZestimate" in prop and prop["rentZestimate"]:
                        rent = prop["rentZestimate"]
                    elif "price" in prop and prop["price"]:
                        rent = prop["price"]
                    else:
                        rent = calculate_rent_estimate(prop)
                    
                    # Skip properties with no rent data
                    if not rent:
                        continue
                    
                    # Create a comparable object
                    comparable = {
                        "address": prop.get("formattedAddress", ""),
                        "rent": rent,
                        "bedrooms": prop.get("bedrooms", 0),
                        "bathrooms": prop.get("bathrooms", 0),
                        "squareFootage": prop.get("squareFootage", 0),
                        "yearBuilt": prop.get("yearBuilt", 0),
                        "latitude": prop.get("latitude", 0),
                        "longitude": prop.get("longitude", 0),
                        "source": "Rentcast",
                        "distance": 0,
                        "similarity": 0.9,  # Default similarity score
                        "adjustedRent": rent,  # Default to the same as rent
                        "credibility": 0.9,  # Default credibility score
                        "propertyType": prop.get("propertyType", "")
                    }
                    
                    # Calculate distance if coordinates are available
                    if subject_lat and subject_lon and prop.get("latitude") and prop.get("longitude"):
                        distance = calculate_distance(
                            subject_lat, subject_lon,
                            prop["latitude"], prop["longitude"]
                        )
                        comparable["distance"] = distance
                        
                        # Adjust similarity based on distance
                        if distance < 1:
                            comparable["similarity"] = 0.95
                        elif distance < 3:
                            comparable["similarity"] = 0.9
                        elif distance < 5:
                            comparable["similarity"] = 0.85
                        else:
                            comparable["similarity"] = 0.8
                    
                    # Add the comparable to our list
                    all_comparables.append(comparable)
                    comparable_count += 1
                    
                    # Limit to 5 comparables
                    if comparable_count >= 5:
                        break
                
                logger.info(f"Found {comparable_count} comparable properties")
            else:
                logger.warning("No properties found in Rentcast API response")
        else:
            logger.error(f"Rentcast API request failed with status code: {response.status_code}")
            logger.error(f"Response: {response.text}")
    except Exception as e:
        logger.exception(f"Exception during Rentcast API request: {str(e)}")
    
    # If we don't have enough comparables from Rentcast, try Zillow
    if len(all_comparables) < 3:
        logger.info("Not enough comparables from Rentcast, trying Zillow")
        zillow_comparables = search_zillow_rentals(property_details)
        all_comparables.extend(zillow_comparables)
    
    # If we still don't have enough comparables, generate mock data
    if len(all_comparables) < 3:
        logger.info("Not enough comparables from APIs, generating mock data")
        mock_comparables = generate_mock_comparables(property_details)
        all_comparables.extend(mock_comparables)
    
    # Sort comparables by similarity (highest first)
    all_comparables.sort(key=lambda x: x["similarity"], reverse=True)
    
    # Return the top 5 comparables
    return all_comparables[:5]

def calculate_rent_estimate(property_data):
    """
    Calculate a rent estimate based on property data when rentZestimate is not available.
    """
    sqft = property_data.get("squareFootage", 0)
    beds = property_data.get("bedrooms", 0)
    baths = property_data.get("bathrooms", 0)
    
    # Simple formula: $2.50 per sqft + $200 per bedroom + $150 per bathroom
    base_rent = sqft * 2.5
    base_rent += beds * 200
    base_rent += baths * 150
    
    return round(base_rent, -1)  # Round to nearest 10

def generate_mock_comparables(property_details):
    """
    Generate mock comparable properties based on the input property details.
    This is used as a fallback when the API call fails.
    """
    # Extract property details
    beds = int(property_details.get("beds", 0))
    baths = float(property_details.get("baths", 0))
    sqft = int(property_details.get("squareFeet", 0))
    property_type = property_details.get("propertyType", "")
    zip_code = property_details.get("zipCode", "")
    
    # Generate base rent (this would normally come from real data)
    base_rent = sqft * 2.5  # Simple formula: $2.50 per sqft
    
    # Adjust for bedrooms and bathrooms
    base_rent += beds * 200  # Add $200 per bedroom
    base_rent += baths * 150  # Add $150 per bathroom
    
    # Create comparable properties with slight variations
    comparables = []
    
    # Comparable 1: Similar size, slightly fewer amenities
    comparables.append({
        "address": f"123 Nearby St, {zip_code}",
        "beds": beds,
        "baths": baths,
        "sqft": sqft - 50,
        "rent": round(base_rent * 0.95, -1),  # 5% lower, rounded to nearest 10
        "yearBuilt": property_details.get("yearBuilt", "Unknown"),
        "distance": 0.5,
        "amenities": ["Parking", "Dishwasher"],
        "propertyType": property_type,
        "source": "Mock Data",
        "latitude": None,
        "longitude": None
    })
    
    # Comparable 2: Slightly larger, more amenities, higher price
    comparables.append({
        "address": f"456 Similar Ave, {zip_code}",
        "beds": beds,
        "baths": baths + 0.5 if baths < 2 else baths,
        "sqft": sqft + 100,
        "rent": round(base_rent * 1.1, -1),  # 10% higher, rounded to nearest 10
        "yearBuilt": property_details.get("yearBuilt", "Unknown"),
        "distance": 0.8,
        "amenities": ["Parking", "Dishwasher", "Pool", "Gym"],
        "propertyType": property_type,
        "source": "Mock Data",
        "latitude": None,
        "longitude": None
    })
    
    # Comparable 3: Similar overall, different mix of features
    comparables.append({
        "address": f"789 Close Blvd, {zip_code}",
        "beds": beds + (1 if beds < 3 else 0),
        "baths": baths - 0.5 if baths > 1 else baths,
        "sqft": sqft + 25,
        "rent": round(base_rent * 1.02, -1),  # 2% higher, rounded to nearest 10
        "yearBuilt": property_details.get("yearBuilt", "Unknown"),
        "distance": 1.2,
        "amenities": ["Washer/Dryer", "Balcony", "Parking"],
        "propertyType": property_type,
        "source": "Mock Data",
        "latitude": None,
        "longitude": None
    })
    
    return comparables

def get_market_trends(property_details):
    """
    Get market trends data from RentCast API based on zip code.
    """
    # Check if we have an API key
    api_key = os.environ.get("RENTCAST_API_KEY")
    if not api_key:
        print("Warning: No RentCast API key found. Skipping market trends.", 
              file=sys.stderr)
        return None
    
    # Clean the API key
    api_key = api_key.strip()

    # Get the zip code from property details
    zip_code = property_details.get("zipCode")
    if not zip_code:
        print("Warning: No zip code provided. Skipping market trends.", 
              file=sys.stderr)
        return None

    # Construct the API request
    url = "https://api.rentcast.io/v1/markets"
    headers = {
        "accept": "application/json",
        "X-API-KEY": api_key
    }
    params = {
        "zipCode": zip_code,
        "propertyType": property_details.get("propertyType", ""),
        "bedrooms": property_details.get("beds", ""),
        "limit": 1
    }

    # Make the API request
    try:
        print(f"DEBUG: Making API request to {url} with params: {params}", 
              file=sys.stderr)
        response = requests.get(url, headers=headers, params=params)
        
        # Check for API errors
        if response.status_code != 200:
            print(f"ERROR: Market trends API returned status code {response.status_code}", file=sys.stderr)
            print(f"Response: {response.text}", file=sys.stderr)
            return None
            
        data = response.json()
        print(f"DEBUG: API response: {json.dumps(data, indent=2)}", file=sys.stderr)
        return data
    except Exception as e:
        print(f"ERROR: Error fetching market trends: {e}", file=sys.stderr)
        return None

def get_historical_rental_data(property_details):
    """
    Get historical rental data for a property from RentCast API.
    """
    # Check if we have an API key
    api_key = os.environ.get("RENTCAST_API_KEY")
    if not api_key:
        print("Warning: No RentCast API key found. Skipping historical data.", 
              file=sys.stderr)
        return None
    
    # Clean the API key
    api_key = api_key.strip()

    # Get the required property details
    address = property_details.get("address")
    if not address:
        print("Warning: No address provided. Skipping historical data.", 
              file=sys.stderr)
        return None

    # Construct the API request
    url = "https://api.rentcast.io/v1/avm/rent/long-term"
    headers = {
        "accept": "application/json",
        "X-API-KEY": api_key
    }
    
    # Prepare parameters for the API request
    params = {
        "address": address,
        "propertyType": property_details.get("propertyType", ""),
        "bedrooms": property_details.get("beds", ""),
        "bathrooms": property_details.get("baths", ""),
        "squareFootage": property_details.get("squareFeet", "")
    }

    # Make the API request
    try:
        print(f"DEBUG: Making API request to {url} with params: {params}", 
              file=sys.stderr)
        response = requests.get(url, headers=headers, params=params)
        
        # Check for API errors
        if response.status_code != 200:
            print(f"ERROR: Historical data API returned status code {response.status_code}", file=sys.stderr)
            print(f"Response: {response.text}", file=sys.stderr)
            return None
            
        data = response.json()
        print(f"DEBUG: API response: {json.dumps(data, indent=2)}", file=sys.stderr)
        return data
    except Exception as e:
        print(f"ERROR: Error fetching historical rental data: {e}", file=sys.stderr)
        return None

def get_property_owner_info(property_details):
    """
    Get property owner information from RentCast API.
    """
    # Check if we have an API key
    api_key = os.environ.get("RENTCAST_API_KEY")
    if not api_key:
        print("Warning: No RentCast API key found. Skipping owner information.", 
              file=sys.stderr)
        return None
    
    # Clean the API key
    api_key = api_key.strip()

    # Get the required property details
    address = property_details.get("address")
    if not address:
        print("Warning: No address provided. Skipping owner information.", 
              file=sys.stderr)
        return None

    # Construct the API request
    url = "https://api.rentcast.io/v1/properties"
    headers = {
        "accept": "application/json",
        "X-API-KEY": api_key
    }
    
    # Prepare parameters for the API request
    params = {
        "address": address,
        "includeDetails": "true"  # Include detailed information including owner data
    }

    # Make the API request
    try:
        print(f"DEBUG: Making API request to {url} with params: {params}", 
              file=sys.stderr)
        response = requests.get(url, headers=headers, params=params)
        
        # Check for API errors
        if response.status_code != 200:
            print(f"ERROR: Property owner API returned status code {response.status_code}", file=sys.stderr)
            print(f"Response: {response.text}", file=sys.stderr)
            return None
            
        data = response.json()
        
        # Check if we got property data
        if not data or not isinstance(data, list) or len(data) == 0:
            print(f"ERROR: No property data found for address: {address}", file=sys.stderr)
            return None
            
        # Get the first property (most relevant match)
        property_data = data[0]
        
        # Extract owner information
        owner_info = {
            "ownerName": property_data.get("ownerName"),
            "ownerAddress": property_data.get("ownerAddress"),
            "ownerCity": property_data.get("ownerCity"),
            "ownerState": property_data.get("ownerState"),
            "ownerZip": property_data.get("ownerZip"),
            "ownerOccupied": property_data.get("ownerOccupied", False),
            "corporateOwned": property_data.get("corporateOwned", False)
        }
        
        print(f"DEBUG: Owner information: {json.dumps(owner_info)}", file=sys.stderr)
        return owner_info
    except Exception as e:
        print(f"ERROR: Error fetching property owner information: {e}", file=sys.stderr)
        return None

def get_property_value_estimate(property_details):
    """
    Get real-time property value estimate from RentCast API.
    """
    # Check if we have an API key
    api_key = os.environ.get("RENTCAST_API_KEY")
    if not api_key:
        print("Warning: No RentCast API key found. Skipping property value estimate.", 
              file=sys.stderr)
        return None
    
    # Clean the API key
    api_key = api_key.strip()

    # Get the required property details
    address = property_details.get("address")
    if not address:
        print("Warning: No address provided. Skipping property value estimate.", 
              file=sys.stderr)
        return None

    # Construct the API request
    url = "https://api.rentcast.io/v1/avm/value"
    headers = {
        "accept": "application/json",
        "X-API-KEY": api_key
    }
    
    # Prepare parameters for the API request
    params = {
        "address": address,
        "propertyType": property_details.get("propertyType", ""),
        "bedrooms": property_details.get("beds", ""),
        "bathrooms": property_details.get("baths", ""),
        "squareFootage": property_details.get("squareFeet", "")
    }

    # Make the API request
    try:
        print(f"DEBUG: Making API request to {url} with params: {params}", 
              file=sys.stderr)
        response = requests.get(url, headers=headers, params=params)
        
        # Check for API errors
        if response.status_code != 200:
            print(f"ERROR: Property value API returned status code {response.status_code}", file=sys.stderr)
            print(f"Response: {response.text}", file=sys.stderr)
            return None
            
        data = response.json()
        print(f"DEBUG: API response: {json.dumps(data, indent=2)}", file=sys.stderr)
        
        # Format the response
        value_estimate = {
            "value": data.get("value"),
            "valueRangeLow": data.get("valueRangeLow"),
            "valueRangeHigh": data.get("valueRangeHigh"),
            "latitude": data.get("latitude"),
            "longitude": data.get("longitude"),
            "comparables": data.get("comparables", [])
        }
        
        return value_estimate
    except Exception as e:
        print(f"ERROR: Error fetching property value estimate: {e}", file=sys.stderr)
        return None

def get_recent_sales_comps(property_details):
    """
    Get recent sales comps from RentCast API.
    """
    # Check if we have an API key
    api_key = os.environ.get("RENTCAST_API_KEY")
    if not api_key:
        print("Warning: No RentCast API key found. Skipping recent sales comps.", 
              file=sys.stderr)
        return None
    
    # Clean the API key
    api_key = api_key.strip()

    # Get the required property details
    zip_code = property_details.get("zipCode")
    if not zip_code:
        print("Warning: No zip code provided. Skipping recent sales comps.", 
              file=sys.stderr)
        return None

    # Construct the API request
    url = "https://api.rentcast.io/v1/listings/sale"
    headers = {
        "accept": "application/json",
        "X-API-KEY": api_key
    }
    
    # Prepare parameters for the API request
    params = {
        "zipCode": zip_code,
        "propertyType": property_details.get("propertyType", ""),
        "bedrooms": property_details.get("beds", ""),
        "bathrooms": property_details.get("baths", ""),
        "limit": 10,  # Limit to 10 recent sales
        "sort": "listedDate",
        "order": "desc"  # Most recent first
    }

    # Make the API request
    try:
        print(f"DEBUG: Making API request to {url} with params: {params}", 
              file=sys.stderr)
        response = requests.get(url, headers=headers, params=params)
        
        # Check for API errors
        if response.status_code != 200:
            print(f"ERROR: Recent sales API returned status code {response.status_code}", file=sys.stderr)
            print(f"Response: {response.text}", file=sys.stderr)
            return None
            
        data = response.json()
        
        # Format the response
        sales_comps = []
        for listing in data:
            sales_comp = {
                "address": listing.get("formattedAddress"),
                "price": listing.get("price"),
                "beds": listing.get("bedrooms"),
                "baths": listing.get("bathrooms"),
                "sqft": listing.get("squareFootage"),
                "yearBuilt": listing.get("yearBuilt"),
                "propertyType": listing.get("propertyType"),
                "listedDate": listing.get("listedDate"),
                "latitude": listing.get("latitude"),
                "longitude": listing.get("longitude"),
                "daysOnMarket": listing.get("daysOnMarket")
            }
            sales_comps.append(sales_comp)
        
        return sales_comps
    except Exception as e:
        print(f"ERROR: Error fetching recent sales comps: {e}", file=sys.stderr)
        return None

def get_recent_rental_comps(property_details):
    """
    Get recent rental comps from RentCast API.
    """
    # Check if we have an API key
    api_key = os.environ.get("RENTCAST_API_KEY")
    if not api_key:
        print("Warning: No RentCast API key found. Skipping recent rental comps.", 
              file=sys.stderr)
        return None
    
    # Clean the API key
    api_key = api_key.strip()

    # Get the required property details
    zip_code = property_details.get("zipCode")
    if not zip_code:
        print("Warning: No zip code provided. Skipping recent rental comps.", 
              file=sys.stderr)
        return None

    # Construct the API request
    url = "https://api.rentcast.io/v1/listings/rental"
    headers = {
        "accept": "application/json",
        "X-API-KEY": api_key
    }
    
    # Prepare parameters for the API request
    params = {
        "zipCode": zip_code,
        "propertyType": property_details.get("propertyType", ""),
        "bedrooms": property_details.get("beds", ""),
        "bathrooms": property_details.get("baths", ""),
        "limit": 10,  # Limit to 10 recent rentals
        "sort": "listedDate",
        "order": "desc"  # Most recent first
    }

    # Make the API request
    try:
        print(f"DEBUG: Making API request to {url} with params: {params}", 
              file=sys.stderr)
        response = requests.get(url, headers=headers, params=params)
        
        # Check for API errors
        if response.status_code != 200:
            print(f"ERROR: Recent rentals API returned status code {response.status_code}", file=sys.stderr)
            print(f"Response: {response.text}", file=sys.stderr)
            return None
            
        data = response.json()
        
        # Format the response
        rental_comps = []
        for listing in data:
            rental_comp = {
                "address": listing.get("formattedAddress"),
                "rent": listing.get("price"),
                "beds": listing.get("bedrooms"),
                "baths": listing.get("bathrooms"),
                "sqft": listing.get("squareFootage"),
                "yearBuilt": listing.get("yearBuilt"),
                "propertyType": listing.get("propertyType"),
                "listedDate": listing.get("listedDate"),
                "latitude": listing.get("latitude"),
                "longitude": listing.get("longitude"),
                "daysOnMarket": listing.get("daysOnMarket")
            }
            rental_comps.append(rental_comp)
        
        return rental_comps
    except Exception as e:
        print(f"ERROR: Error fetching recent rental comps: {e}", file=sys.stderr)
        return None

def get_detailed_market_statistics(property_details):
    """
    Get detailed market statistics from RentCast API.
    """
    # Check if we have an API key
    api_key = os.environ.get("RENTCAST_API_KEY")
    if not api_key:
        print("Warning: No RentCast API key found. Skipping detailed market statistics.", 
              file=sys.stderr)
        return None
    
    # Clean the API key
    api_key = api_key.strip()

    # Get the zip code from property details
    zip_code = property_details.get("zipCode")
    if not zip_code:
        print("Warning: No zip code provided. Skipping detailed market statistics.", 
              file=sys.stderr)
        return None

    # Construct the API request
    url = "https://api.rentcast.io/v1/markets/statistics"
    headers = {
        "accept": "application/json",
        "X-API-KEY": api_key
    }
    params = {
        "zipCode": zip_code,
        "propertyType": property_details.get("propertyType", ""),
        "bedrooms": property_details.get("beds", "")
    }

    # Make the API request
    try:
        print(f"DEBUG: Making API request to {url} with params: {params}", 
              file=sys.stderr)
        response = requests.get(url, headers=headers, params=params)
        
        # Check for API errors
        if response.status_code != 200:
            print(f"ERROR: Market statistics API returned status code {response.status_code}", file=sys.stderr)
            print(f"Response: {response.text}", file=sys.stderr)
            return None
            
        data = response.json()
        print(f"DEBUG: API response: {json.dumps(data, indent=2)}", file=sys.stderr)
        
        # Extract key statistics
        market_stats = {
            "rentalMarket": {
                "averageRent": data.get("rentalMarket", {}).get("averageRent"),
                "medianRent": data.get("rentalMarket", {}).get("medianRent"),
                "averageDaysOnMarket": data.get("rentalMarket", {}).get("averageDaysOnMarket"),
                "totalListings": data.get("rentalMarket", {}).get("totalListings"),
                "rentTrend": data.get("rentalMarket", {}).get("rentTrend"),
                "rentTrendPercentage": data.get("rentalMarket", {}).get("rentTrendPercentage")
            },
            "saleMarket": {
                "averagePrice": data.get("saleMarket", {}).get("averagePrice"),
                "medianPrice": data.get("saleMarket", {}).get("medianPrice"),
                "averageDaysOnMarket": data.get("saleMarket", {}).get("averageDaysOnMarket"),
                "totalListings": data.get("saleMarket", {}).get("totalListings"),
                "priceTrend": data.get("saleMarket", {}).get("priceTrend"),
                "priceTrendPercentage": data.get("saleMarket", {}).get("priceTrendPercentage")
            },
            "investmentMetrics": {
                "averageCapRate": data.get("investmentMetrics", {}).get("averageCapRate"),
                "medianCapRate": data.get("investmentMetrics", {}).get("medianCapRate"),
                "averageCashOnCashReturn": data.get("investmentMetrics", {}).get("averageCashOnCashReturn"),
                "medianCashOnCashReturn": data.get("investmentMetrics", {}).get("medianCashOnCashReturn"),
                "averageRentToPrice": data.get("investmentMetrics", {}).get("averageRentToPrice"),
                "medianRentToPrice": data.get("investmentMetrics", {}).get("medianRentToPrice")
            }
        }
        
        return market_stats
    except Exception as e:
        print(f"ERROR: Error fetching detailed market statistics: {e}", file=sys.stderr)
        return None

def analyze_property(property_details):
    """
    Analyze a property based on the provided details.
    Returns a comprehensive analysis including rent estimate, comparable properties,
    market trends, and recommendations.
    """
    # First, geocode the address to get location data
    logger.info("Starting property analysis")
    logger.info(f"Property details: {json.dumps(property_details)}")
    
    # Geocode the address to get location data
    location_data = geocode_address(property_details)
    if not location_data:
        logger.error("Failed to geocode property address")
        # Continue with analysis but note the error
        property_details["geocoding_error"] = True
    else:
        logger.info(f"Successfully geocoded property to: {location_data['latitude']}, {location_data['longitude']}")
        # Make sure the property details include the location data
        property_details.update(location_data)
    
    # Find comparable properties
    comparables = find_comparable_properties(property_details)
    logger.info(f"Found {len(comparables)} comparable properties")
    
    # Get market trends data
    market_trends = get_market_trends(property_details)
    
    # Get historical rental data
    historical_data = get_historical_rental_data(property_details)
    
    # Calculate average rent from comparables
    if comparables:
        avg_rent = sum(comp["rent"] for comp in comparables) / len(comparables)
        
        # Generate rent range
        low_rent = round(avg_rent * 0.9, -1)  # 10% below average
        high_rent = round(avg_rent * 1.1, -1)  # 10% above average
        median_rent = round(avg_rent, -1)  # Average, rounded to nearest 10
    else:
        logger.warning("No comparable properties found, using default rent values")
        # Default values if no comparables are found
        avg_rent = 1500
        low_rent = 1350
        median_rent = 1500
        high_rent = 1650
    
    # Generate influencing factors
    influencing_factors = [
        f"Property size ({property_details.get('squareFeet', 'Unknown')} sqft)",
        f"Number of bedrooms ({property_details.get('beds', 'Unknown')})",
        f"Number of bathrooms ({property_details.get('baths', 'Unknown')})",
        "Location and proximity to amenities",
        "Property condition and age"
    ]
    
    # Add location details if available
    if "city" in property_details and "state" in property_details:
        influencing_factors.insert(
            3, f"Location in {property_details['city']}, {property_details['state']}"
        )
    elif "zip_code" in property_details:
        influencing_factors.insert(
            3, f"Location in ZIP code {property_details['zip_code']}"
        )
    
    # Add amenities as a factor if provided
    amenities = property_details.get('amenities', [])
    if amenities:
        amenities_text = f"Available amenities: {', '.join(amenities)}"
        influencing_factors.append(amenities_text)
    
    # Generate market comparison
    data_sources = set(comp.get("source", "Mock Data") for comp in comparables)
    data_source = ", ".join(data_sources) if data_sources else "estimated data"
    
    location_text = ""
    if "city" in property_details and "state" in property_details:
        location_text = f"in {property_details['city']}, {property_details['state']}"
    elif "zip_code" in property_details:
        location_text = f"in ZIP code {property_details['zip_code']}"
    
    market_comparison = (
        f"Based on {len(comparables)} comparable properties {location_text} "
        f"(using {data_source}), the average rent is ${avg_rent:.2f} per month. "
        f"Your property is "
        f"{'competitively' if median_rent <= avg_rent else 'premium'} "
        f"priced compared to similar properties in the area."
    )
    
    # Add market trends information if available
    market_insights = []
    if market_trends and "rentalData" in market_trends:
        rental_data = market_trends["rentalData"]
        market_insights.append(
            f"The average rent in {property_details.get('zipCode', 'your area')} "
            f"is ${rental_data.get('averageRent', 0):,} with a median of "
            f"${rental_data.get('medianRent', 0):,}."
        )
        
        # Add days on market info
        avg_days = rental_data.get("averageDaysOnMarket")
        if avg_days:
            market_insights.append(
                f"Properties in this area stay on the market for an average of {avg_days} days."
            )
        
        # Add info about rental inventory
        new_listings = rental_data.get("newListings")
        total_listings = rental_data.get("totalListings")
        if new_listings and total_listings:
            market_insights.append(
                f"There are currently {total_listings} rental listings in this area, "
                f"with {new_listings} new listings in the past month."
            )
        
        # Add historical trend information
        if "history" in rental_data:
            history = rental_data["history"]
            months = sorted(history.keys())
            if len(months) >= 2:
                oldest = history[months[0]]
                newest = history[months[-1]]
                if "averageRent" in oldest and "averageRent" in newest:
                    old_rent = oldest["averageRent"]
                    new_rent = newest["averageRent"]
                    change = ((new_rent - old_rent) / old_rent) * 100
                    direction = "increased" if change > 0 else "decreased"
                    market_insights.append(
                        f"Rents have {direction} by {abs(change):.1f}% over the past "
                        f"{len(months)} months in this area."
                    )
    
    # Add historical property data if available
    if historical_data:
        estimated_rent = historical_data.get("rent")
        rent_range = historical_data.get("rentRangeLow", 0), historical_data.get("rentRangeHigh", 0)
        
        if estimated_rent:
            market_insights.append(
                f"Based on historical data, the estimated rent for this specific property "
                f"is ${estimated_rent:,}, with a range of ${rent_range[0]:,} to ${rent_range[1]:,}."
            )
    
    # Generate recommendations
    recommendations = [
        "Consider highlighting unique features in your listing",
        "Ensure all amenities are clearly listed in your marketing materials",
        "Take high-quality photos to showcase the property's best features",
        "Consider offering incentives for longer lease terms"
    ]
    
    # Add market-based recommendations
    if market_trends and "rentalData" in market_trends:
        rental_data = market_trends["rentalData"]
        avg_days = rental_data.get("averageDaysOnMarket", 0)
        
        if avg_days > 60:
            recommendations.append(
                "Properties in this area take longer to rent. Consider pricing competitively "
                "or offering move-in specials to attract tenants."
            )
        elif avg_days < 30:
            recommendations.append(
                "Properties in this area rent quickly. You may be able to command a premium "
                "price, especially if your property has desirable features."
            )
    
    # If the property is older, add a recommendation about updates
    if property_details.get("yearBuilt") and property_details.get("yearBuilt").isdigit():
        year_built = int(property_details.get("yearBuilt"))
        current_year = 2024
        if current_year - year_built > 15:
            update_rec = (
                "Consider updating key areas like kitchen or bathrooms "
                "to justify higher rent"
            )
            recommendations.append(update_rec)
    
    # Create Google Maps and Street View URLs
    maps_data = {}
    street_view_data = {}
    
    # Get coordinates from property details or historical data
    latitude = property_details.get("latitude")
    longitude = property_details.get("longitude")
    
    if not latitude and not longitude and historical_data:
        latitude = historical_data.get("latitude")
        longitude = historical_data.get("longitude")
    
    if latitude and longitude:
        # Google Maps URL
        maps_url = f"https://www.google.com/maps?q={latitude},{longitude}"
        maps_data = {
            "url": maps_url,
            "latitude": latitude,
            "longitude": longitude
        }
        
        # Google Street View URL
        # Parameters:
        # - size: image size (max 640x640 for free tier)
        # - location: lat,lng
        # - fov: field of view (zoom level, 90 is default)
        # - heading: camera direction in degrees (0 is north, 90 is east)
        # - pitch: camera angle (-90 to 90, 0 is horizontal)
        street_view_url = (
            f"https://maps.googleapis.com/maps/api/streetview?"
            f"size=600x400&location={latitude},{longitude}"
            f"&fov=90&heading=270&pitch=0"
        )
        
        # Add API key if available
        google_api_key = os.environ.get("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY")
        if google_api_key:
            street_view_url += f"&key={google_api_key}"
        
        street_view_data = {
            "url": street_view_url,
            "latitude": latitude,
            "longitude": longitude,
            "address": property_details.get("address", "")
        }
    
    # Get property owner information
    owner_info = get_property_owner_info(property_details)
    
    # Get property value estimate
    value_estimate = get_property_value_estimate(property_details)
    
    # Get recent sales comps
    recent_sales = get_recent_sales_comps(property_details)
    
    # Get recent rental comps
    recent_rentals = get_recent_rental_comps(property_details)
    
    # Get detailed market statistics
    detailed_market_stats = get_detailed_market_statistics(property_details)
    
    # Create the analysis result
    analysis = {
        "rentRange": {
            "low": int(low_rent),
            "median": int(median_rent),
            "high": int(high_rent)
        },
        "influencingFactors": influencing_factors,
        "marketComparison": market_comparison,
        "marketInsights": market_insights,
        "recommendations": recommendations,
        "comparableProperties": comparables,
        "dataSource": data_source,
        "mapData": {
            "center": {
                "lat": latitude,
                "lng": longitude
            },
            "comparables": [
                {
                    "lat": comp.get("latitude"),
                    "lng": comp.get("longitude"),
                    "address": comp.get("address"),
                    "rent": comp.get("rent"),
                    "distance": comp.get("distance")
                } for comp in comparables if comp.get("latitude") and comp.get("longitude")
            ]
        }
    }
    
    # Add maps and street view data if available
    if maps_data:
        analysis["mapsData"] = maps_data
    
    if street_view_data:
        analysis["streetViewData"] = street_view_data
    
    # Add market trends data if available
    if market_trends:
        analysis["marketTrends"] = market_trends
    
    # Add historical data if available
    if historical_data:
        analysis["historicalData"] = historical_data
    
    # Add the new data to the analysis result
    if owner_info:
        analysis["ownerInfo"] = owner_info
    
    if value_estimate:
        analysis["valueEstimate"] = value_estimate
    
    if recent_sales:
        analysis["recentSales"] = recent_sales
    
    if recent_rentals:
        analysis["recentRentals"] = recent_rentals
    
    if detailed_market_stats:
        analysis["detailedMarketStats"] = detailed_market_stats
    
    return analysis

def geocode_address(property_details):
    """
    Geocode the property address to get latitude and longitude coordinates.
    Also extracts city, state, and other location data.
    """
    address = property_details.get("address", "")
    zip_code = property_details.get("zipCode", "")
    city = property_details.get("city", "")
    unit = property_details.get("unit", "")
    
    # If we already have city in the input, use it
    location_data = {
        "latitude": None,
        "longitude": None,
        "city": city,
        "zip_code": zip_code,
        "state": property_details.get("state", "")
    }
    
    if not address:
        logger.error("No address provided for geocoding")
        return location_data
    
    # Combine address components
    full_address = address
    if unit:
        full_address += f" {unit}"
    if city:
        full_address += f", {city}"
    if zip_code and zip_code not in full_address:
        full_address += f", {zip_code}"
    
    logger.info(f"Geocoding address: {full_address}")
    
    # Get Google Maps API key
    api_key = os.environ.get("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY")
    if not api_key:
        logger.error("No Google Maps API key found in environment variables")
        return location_data
    
    try:
        # Prepare the API request
        url = "https://maps.googleapis.com/maps/api/geocode/json"
        params = {
            "address": full_address,
            "key": api_key
        }
        
        # Make the API request
        geocode_response = requests.get(url, params=params)
        
        # Check if the request was successful
        if geocode_response.status_code == 200:
            geocode_data = geocode_response.json()
            
            # Check if we got results
            if geocode_data["status"] == "OK" and geocode_data["results"]:
                # Extract the location data
                location = geocode_data["results"][0]["geometry"]["location"]
                latitude = location["lat"]
                longitude = location["lng"]
                
                # Extract address components
                address_components = geocode_data["results"][0].get("address_components", [])
                location_data = {
                    "latitude": latitude,
                    "longitude": longitude,
                    "formatted_address": geocode_data["results"][0].get("formatted_address", ""),
                    "city": city,  # Use the provided city if available
                    "zip_code": zip_code  # Use the provided zip code if available
                }
                
                # Extract city, state, zip, etc. from geocoding results if not already provided
                for component in address_components:
                    types = component.get("types", [])
                    if "locality" in types and not location_data.get("city"):
                        location_data["city"] = component.get("long_name")
                    elif "administrative_area_level_1" in types:
                        location_data["state"] = component.get("short_name")
                    elif "postal_code" in types and not location_data.get("zip_code"):
                        location_data["zip_code"] = component.get("long_name")
                    elif "neighborhood" in types:
                        location_data["neighborhood"] = component.get("long_name")
                    elif "route" in types:
                        location_data["street"] = component.get("long_name")
                    elif "street_number" in types:
                        location_data["street_number"] = component.get("long_name")
                
                logger.info(f"Successfully geocoded address to: {latitude}, {longitude}")
                logger.debug(f"Location data: {json.dumps(location_data)}")
                
                return location_data
            else:
                logger.error(f"No geocoding results found for address: {full_address}")
                logger.error(f"Geocoding status: {geocode_data['status']}")
                
                # Handle specific error cases
                if geocode_data["status"] == "REQUEST_DENIED":
                    error_message = geocode_data.get("error_message", "")
                    if "not authorized" in error_message.lower():
                        logger.error("Google Maps API key is not authorized for the Geocoding API. Please enable it in the Google Cloud Console.")
                    else:
                        logger.error("Google Maps API key is invalid or has insufficient permissions")
                elif geocode_data["status"] == "ZERO_RESULTS":
                    logger.error("No results found for the address. Check if the address is valid.")
                elif geocode_data["status"] == "OVER_QUERY_LIMIT":
                    logger.error("Google Maps API query limit exceeded")
                
                # Return the basic location data we have
                return location_data
        else:
            logger.error(f"Geocoding failed with status code: {geocode_response.status_code}")
            logger.error(f"Response: {geocode_response.text}")
            # Return the basic location data we have
            return location_data
    except Exception as e:
        logger.exception(f"Exception during geocoding: {str(e)}")
        # Return the basic location data we have
        return location_data

def main():
    """
    Main function to process input and return analysis.
    """
    try:
        # Read input from stdin or command line argument
        if len(sys.argv) > 1:
            property_data = json.loads(sys.argv[1])
        else:
            property_data = json.loads(sys.stdin.read())
        
        # Analyze the property
        analysis = analyze_property(property_data)
        
        # Print the result as JSON
        print(json.dumps(analysis))
        
    except Exception as e:
        error_response = {
            "error": str(e),
            "status": "error"
        }
        print(json.dumps(error_response))
        sys.exit(1)

if __name__ == "__main__":
    main() 
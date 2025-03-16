#!/usr/bin/env python3
import os
import sys
import json
import requests
from dotenv import load_dotenv

# Try to load environment variables from .env files
try:
    load_dotenv()
    load_dotenv(".env.local")
except Exception as e:
    print(f"Warning: Could not load environment variables: {str(e)}")

def find_comparable_properties(property_details):
    """
    Find comparable rental properties using the Rentcast API.
    Falls back to mock data if the API call fails.
    """
    # Get API key from input data or environment
    api_key = property_details.get("rentcastApiKey") or os.environ.get("RENTCAST_API_KEY")
    
    if not api_key:
        print("Warning: No Rentcast API key found. Using mock data.")
        return generate_mock_comparables(property_details)
    
    try:
        # Extract property details
        zip_code = property_details.get("zipCode", "")
        beds = property_details.get("beds", "")
        baths = property_details.get("baths", "")
        property_type = property_details.get("propertyType", "")
        
        # Prepare the API request
        url = "https://api.rentcast.io/v1/properties"
        headers = {
            "X-API-KEY": api_key,
            "Content-Type": "application/json"
        }
        
        # Build the query parameters
        params = {}
        if zip_code:
            params["zipCode"] = zip_code
        if beds:
            params["bedrooms"] = beds
        if baths:
            params["bathrooms"] = baths
        if property_type:
            params["propertyType"] = property_type
        
        print(f"DEBUG: Making API request to {url} with params: {params}")
        
        # Make the API request
        response = requests.get(url, headers=headers, params=params)
        
        # Check if the request was successful
        if response.status_code == 200:
            data = response.json()
            print(f"DEBUG: API response: {json.dumps(data)[:500]}...")
            
            # Check if properties is a list
            properties = data.get("properties")
            if isinstance(properties, list) and properties:
                formatted_comps = []
                for prop in properties[:3]:  # Limit to 3 comparables
                    formatted_comp = {
                        "address": prop.get("formattedAddress", "Unknown"),
                        "beds": prop.get("bedrooms", 0),
                        "baths": prop.get("bathrooms", 0),
                        "sqft": prop.get("squareFootage", 0),
                        "rent": prop.get("rentZestimate", 0),
                        "yearBuilt": prop.get("yearBuilt", "Unknown"),
                        "distance": 0,  # Not provided by this endpoint
                        "amenities": [],  # Not provided by this endpoint
                        "propertyType": prop.get("propertyType", "Unknown"),
                        "source": "Rentcast API"
                    }
                    formatted_comps.append(formatted_comp)
                return formatted_comps
            else:
                print(f"DEBUG: No properties found in API response. Properties: {properties}")
        else:
            print(f"DEBUG: API response status code: {response.status_code}")
            print(f"DEBUG: API response text: {response.text}")
        
        # If the API call failed or returned no properties, fall back to mock data
        print(f"API call failed with status {response.status_code}. Using mock data.")
        return generate_mock_comparables(property_details)
    
    except Exception as e:
        print(f"Error calling Rentcast API: {str(e)}. Using mock data.")
        return generate_mock_comparables(property_details)

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
        "source": "Mock Data"
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
        "source": "Mock Data"
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
        "source": "Mock Data"
    })
    
    return comparables

def analyze_property(property_details):
    """
    Analyze the property and generate a rent estimate
    based on the property details and comparable properties.
    """
    # Find comparable properties
    comparables = find_comparable_properties(property_details)
    
    # Calculate average rent from comparables
    avg_rent = sum(comp["rent"] for comp in comparables) / len(comparables)
    
    # Generate rent range
    low_rent = round(avg_rent * 0.9, -1)  # 10% below average
    high_rent = round(avg_rent * 1.1, -1)  # 10% above average
    median_rent = round(avg_rent, -1)  # Average, rounded to nearest 10
    
    # Generate influencing factors
    influencing_factors = [
        f"Property size ({property_details.get('squareFeet', 'Unknown')} sqft)",
        f"Number of bedrooms ({property_details.get('beds', 'Unknown')})",
        f"Number of bathrooms ({property_details.get('baths', 'Unknown')})",
        "Location and proximity to amenities",
        "Property condition and age"
    ]
    
    # Add amenities as a factor if provided
    amenities = property_details.get('amenities', [])
    if amenities:
        amenities_text = f"Available amenities: {', '.join(amenities)}"
        influencing_factors.append(amenities_text)
    
    # Generate market comparison
    data_source = comparables[0].get("source", "Mock Data")
    market_comparison = (
        f"Based on {len(comparables)} comparable properties in the area "
        f"(using {data_source}), the average rent is ${avg_rent:.2f} per month. "
        f"Your property is "
        f"{'competitively' if median_rent <= avg_rent else 'premium'} "
        f"priced compared to similar properties in the area."
    )
    
    # Generate recommendations
    recommendations = [
        "Consider highlighting unique features in your listing",
        "Ensure all amenities are clearly listed in your marketing materials",
        "Take high-quality photos to showcase the property's best features",
        "Consider offering incentives for longer lease terms"
    ]
    
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
    
    # Create the analysis result
    analysis = {
        "rentRange": {
            "low": int(low_rent),
            "median": int(median_rent),
            "high": int(high_rent)
        },
        "influencingFactors": influencing_factors,
        "marketComparison": market_comparison,
        "recommendations": recommendations,
        "comparableProperties": comparables,
        "dataSource": data_source
    }
    
    return analysis

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
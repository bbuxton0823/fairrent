# FairRent API Documentation

This document provides details about the API endpoints available in the FairRent application.

## Rent Analysis API

### Endpoint

`POST /api/rent-analysis`

### Description

Analyzes a rental property and provides rent estimates, comparable properties, and recommendations based on real market data from the Rentcast API.

### Request

#### Headers

```
Content-Type: application/json
```

#### Body Parameters

| Parameter    | Type     | Required | Description                                      |
|--------------|----------|----------|--------------------------------------------------|
| address      | string   | Yes      | Street address of the property                   |
| city         | string   | No       | City where the property is located               |
| state        | string   | No       | State where the property is located              |
| zipCode      | string   | Yes      | ZIP code of the property                         |
| beds         | number   | Yes      | Number of bedrooms                               |
| baths        | number   | Yes      | Number of bathrooms                              |
| squareFeet   | number   | Yes      | Square footage of the property                   |
| propertyType | string   | No       | Type of property (apartment, house, condo, etc.) |
| yearBuilt    | string   | No       | Year the property was built                      |
| amenities    | string[] | No       | List of amenities available at the property      |

#### Example Request

```json
{
  "address": "123 Main St",
  "city": "San Francisco",
  "state": "CA",
  "zipCode": "94105",
  "beds": 2,
  "baths": 2,
  "squareFeet": 1200,
  "propertyType": "apartment",
  "yearBuilt": "2010",
  "amenities": ["Parking", "Dishwasher", "Washer/Dryer"]
}
```

### Response

#### Success Response (200 OK)

```json
{
  "rentRange": {
    "low": 3220,
    "median": 3580,
    "high": 3940
  },
  "influencingFactors": [
    "Property size (1200 sqft)",
    "Number of bedrooms (2)",
    "Number of bathrooms (2)",
    "Location and proximity to amenities",
    "Property condition and age",
    "Available amenities: Parking, Dishwasher, Washer/Dryer"
  ],
  "marketComparison": "Based on 3 comparable properties in the area (using Rentcast API), the average rent is $3580.00 per month. Your property is competitively priced compared to similar properties in the area.",
  "recommendations": [
    "Consider highlighting unique features in your listing",
    "Ensure all amenities are clearly listed in your marketing materials",
    "Take high-quality photos to showcase the property's best features",
    "Consider offering incentives for longer lease terms"
  ],
  "comparableProperties": [
    {
      "address": "299 Fremont St, San Francisco, CA 94105",
      "beds": 2,
      "baths": 2,
      "sqft": 896,
      "rent": 2940,
      "yearBuilt": 2016,
      "distance": 0,
      "amenities": [],
      "propertyType": "Apartment",
      "source": "Rentcast API"
    },
    {
      "address": "201 Folsom St, Apt 25A, San Francisco, CA 94105",
      "beds": 2,
      "baths": 2,
      "sqft": 1368,
      "rent": 4120,
      "yearBuilt": 2016,
      "distance": 0,
      "amenities": [],
      "propertyType": "Apartment",
      "source": "Rentcast API"
    },
    {
      "address": "201 Folsom St, Apt 14F, San Francisco, CA 94105",
      "beds": 2,
      "baths": 2,
      "sqft": 1191,
      "rent": 3680,
      "yearBuilt": 2016,
      "distance": 0,
      "amenities": [],
      "propertyType": "Apartment",
      "source": "Rentcast API"
    }
  ],
  "dataSource": "Rentcast API"
}
```

#### Error Responses

**400 Bad Request**

```json
{
  "error": "Missing required fields"
}
```

**500 Internal Server Error**

```json
{
  "error": "Failed to analyze rent"
}
```

### Data Source

The API uses the Rentcast API to fetch real rental market data. If the Rentcast API is unavailable or returns an error, the system will fall back to generating mock data based on the property details provided.

## Future Endpoints

The following endpoints are planned for future versions:

- `GET /api/property/{id}` - Get details for a specific property
- `POST /api/compliance` - Check rent compliance with local regulations
- `POST /api/description` - Generate AI-powered property descriptions 
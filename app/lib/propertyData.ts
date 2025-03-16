import axios from 'axios';

// We'll use multiple data sources for comprehensive coverage
const REALTOR_API_KEY = process.env.REALTOR_COM_API_KEY;
const ZILLOW_API_KEY = process.env.ZILLOW_API_KEY;
const ATTOM_API_KEY = process.env.ATTOM_API_KEY;
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;

export async function getComparableProperties(address: string, propertyType: string, radius: number = 1) {
  try {
    // Get property data from RapidAPI
    const response = await axios.get('https://realty-in-us.p.rapidapi.com/properties/v2/list-for-sale', {
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'realty-in-us.p.rapidapi.com'
      },
      params: {
        city: address.split(',')[1].trim(),
        state_code: address.split(',')[2].trim(),
        offset: '0',
        limit: '10',
        sort: 'relevance',
        property_type: propertyType
      }
    });

    return processComparableProperties(response.data.properties);
  } catch (error) {
    console.error('Error fetching comparable properties:', error);
    throw error;
  }
}

function processComparableProperties(properties: any[]) {
  return properties.map(property => ({
    address: `${property.address.line}, ${property.address.city}, ${property.address.state_code}`,
    price: property.price,
    beds: property.beds,
    baths: property.baths,
    sqft: property.building_size?.size || 0,
    yearBuilt: property.year_built,
    distance: property.distance,
    lastSold: property.last_sold_date,
    propertyType: property.prop_type
  }));
} 
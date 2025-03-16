export const ADJUSTMENT_FACTORS = {
  // Base adjustments for core features
  BEDROOM: 150, // $ per bedroom difference
  BATHROOM: 100, // $ per bathroom difference
  SQFT_PER_100: 25, // $ per 100 sqft difference
  AGE_PER_10_YEARS: -50, // $ per 10 years of age difference
  LOCATION_SCORE: 100, // $ per point of location score difference

  // Amenity-specific adjustments
  AMENITIES: {
    // Interior amenities
    'Central AC': 50,
    'In-Unit Washer/Dryer': 75,
    'Dishwasher': 25,
    'Hardwood Floors': 30,
    'Updated Kitchen': 50,
    'Updated Bathroom': 40,
    'Walk-in Closet': 25,
    'Fireplace': 30,

    // Exterior amenities
    'Parking': 50,
    'Garage': 100,
    'Pool': 75,
    'Gym': 50,
    'Elevator': 40,
    'Storage': 25,
    'Balcony': 35,
    'Patio': 35,
    'Yard': 50,

    // Security features
    'Gated Community': 40,
    'Security System': 30,
    'Doorman': 75,

    // Utilities
    'Water Included': 40,
    'Heat Included': 60,
    'Electric Included': 50,
    'Gas Included': 40,
    'Internet Included': 45,
    'Cable TV Included': 35,

    // Community amenities
    'Package Service': 20,
    'Pet Friendly': 35,
    'Dog Park': 25,
    'Playground': 20,
    'BBQ Area': 15,
    'Community Room': 20,
    'Business Center': 25,
  },

  // Location-based adjustments
  LOCATION: {
    'Near Public Transit': 50,
    'Near Shopping': 30,
    'Near Parks': 25,
    'Near Schools': 35,
    'Near Healthcare': 30,
    'Near Entertainment': 25,
  },

  // View adjustments
  VIEW: {
    'Water View': 100,
    'City View': 75,
    'Park View': 50,
    'Garden View': 25,
  }
}; 
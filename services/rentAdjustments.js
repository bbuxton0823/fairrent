import { ADJUSTMENT_FACTORS } from './rentAdjustmentsConfig';

export function calculateAdjustedRent(baseRent, propertyDetails, comparableProperty) {
  let adjustedRent = baseRent;
  let adjustments = [];

  // Bedroom adjustment
  const bedroomDiff = propertyDetails.beds - comparableProperty.beds;
  if (bedroomDiff !== 0) {
    const bedroomAdjustment = bedroomDiff * ADJUSTMENT_FACTORS.BEDROOM;
    adjustedRent += bedroomAdjustment;
    adjustments.push({
      factor: 'Bedrooms',
      amount: bedroomAdjustment,
      reason: `${Math.abs(bedroomDiff)} bedroom difference`
    });
  }

  // Bathroom adjustment
  const bathroomDiff = propertyDetails.baths - comparableProperty.baths;
  if (bathroomDiff !== 0) {
    const bathroomAdjustment = bathroomDiff * ADJUSTMENT_FACTORS.BATHROOM;
    adjustedRent += bathroomAdjustment;
    adjustments.push({
      factor: 'Bathrooms',
      amount: bathroomAdjustment,
      reason: `${Math.abs(bathroomDiff)} bathroom difference`
    });
  }

  // Square footage adjustment
  const sqftDiff = propertyDetails.sqft - comparableProperty.sqft;
  if (Math.abs(sqftDiff) > 100) { // Only adjust if difference is significant
    const sqftAdjustment = (sqftDiff / 100) * ADJUSTMENT_FACTORS.SQFT_PER_100;
    adjustedRent += sqftAdjustment;
    adjustments.push({
      factor: 'Square Footage',
      amount: sqftAdjustment,
      reason: `${Math.abs(sqftDiff)} sqft difference`
    });
  }

  // Age/condition adjustment
  const yearDiff = propertyDetails.yearBuilt - comparableProperty.yearBuilt;
  if (Math.abs(yearDiff) > 5) { // Only adjust if age difference is significant
    const ageAdjustment = (yearDiff / 10) * ADJUSTMENT_FACTORS.AGE_PER_10_YEARS;
    adjustedRent += ageAdjustment;
    adjustments.push({
      factor: 'Age/Condition',
      amount: ageAdjustment,
      reason: `${Math.abs(yearDiff)} years difference in age`
    });
  }

  // Amenities adjustment
  const amenityDiffs = compareAmenities(propertyDetails.amenities, comparableProperty.amenities);
  if (amenityDiffs.length > 0) {
    const amenityAdjustment = calculateAmenityAdjustment(amenityDiffs);
    adjustedRent += amenityAdjustment;
    adjustments.push({
      factor: 'Amenities',
      amount: amenityAdjustment,
      reason: `Different amenities: ${amenityDiffs.join(', ')}`
    });
  }

  // Location quality adjustment
  if (propertyDetails.locationScore && comparableProperty.locationScore) {
    const locationDiff = propertyDetails.locationScore - comparableProperty.locationScore;
    if (Math.abs(locationDiff) > 0.5) { // Only adjust if difference is significant
      const locationAdjustment = locationDiff * ADJUSTMENT_FACTORS.LOCATION_SCORE;
      adjustedRent += locationAdjustment;
      adjustments.push({
        factor: 'Location',
        amount: locationAdjustment,
        reason: `Location score difference of ${locationDiff.toFixed(1)}`
      });
    }
  }

  return {
    originalRent: baseRent,
    adjustedRent: Math.round(adjustedRent),
    adjustments,
    totalAdjustment: Math.round(adjustedRent - baseRent)
  };
}

function compareAmenities(subjectAmenities, compAmenities) {
  const differences = [];
  
  // Check amenities present in subject but not in comparable
  subjectAmenities.forEach(amenity => {
    if (!compAmenities.includes(amenity)) {
      differences.push(`+${amenity}`);
    }
  });
  
  // Check amenities present in comparable but not in subject
  compAmenities.forEach(amenity => {
    if (!subjectAmenities.includes(amenity)) {
      differences.push(`-${amenity}`);
    }
  });
  
  return differences;
}

function calculateAmenityAdjustment(amenityDiffs) {
  return amenityDiffs.reduce((total, diff) => {
    const amenity = diff.substring(1); // Remove +/- prefix
    const multiplier = diff.startsWith('+') ? 1 : -1;
    return total + (ADJUSTMENT_FACTORS.AMENITIES[amenity] || 0) * multiplier;
  }, 0);
} 
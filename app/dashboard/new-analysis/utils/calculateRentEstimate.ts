interface RentFactors {
  comparableMedianRent: number
  crimeIndex: number
  walkScore: number
  schoolScore: number
  amenitiesCount: number
  propertyAge: number
  squareFeet: number
}

// Weights should sum to 1
const WEIGHTS = {
  // Location-based factors (50%)
  comparableRents: 0.30,    // Comparable properties have highest weight
  crimeRate: 0.10,         // Lower crime rate = higher rent
  walkScore: 0.05,         // Better walkability = higher rent
  schoolScore: 0.05,       // Better schools = higher rent

  // Property-based factors (50%)
  amenities: 0.20,         // More amenities = higher rent
  propertyAge: 0.10,       // Newer property = higher rent
  squareFootage: 0.20      // Larger space = higher rent
}

// Score modifiers (percentage adjustments)
const MODIFIERS = {
  crimeRate: {
    high: -0.10,    // High crime area reduces rent by 10%
    medium: 0,      // Medium crime has no effect
    low: 0.05       // Low crime increases rent by 5%
  },
  walkScore: {
    high: 0.05,     // Very walkable adds 5%
    medium: 0,      // Average walkability no change
    low: -0.05      // Poor walkability reduces by 5%
  },
  propertyAge: {
    new: 0.10,      // New construction adds 10%
    recent: 0.05,   // Recent construction adds 5%
    old: -0.05      // Older property reduces by 5%
  }
}

export function calculateRentEstimate(factors: RentFactors): {
  minRent: number
  maxRent: number
  confidence: number
} {
  // Start with comparable median rent
  const baseRent = factors.comparableMedianRent

  // Apply location-based adjustments
  const crimeModifier = factors.crimeIndex < 20 ? MODIFIERS.crimeRate.low :
                       factors.crimeIndex > 50 ? MODIFIERS.crimeRate.high :
                       MODIFIERS.crimeRate.medium

  const walkModifier = factors.walkScore > 80 ? MODIFIERS.walkScore.high :
                      factors.walkScore < 40 ? MODIFIERS.walkScore.low :
                      MODIFIERS.walkScore.medium

  const propertyAgeModifier = factors.propertyAge < 5 ? MODIFIERS.propertyAge.new :
                             factors.propertyAge < 15 ? MODIFIERS.propertyAge.recent :
                             MODIFIERS.propertyAge.old

  // Calculate weighted adjustments
  const adjustments = {
    crime: baseRent * WEIGHTS.crimeRate * crimeModifier,
    walkability: baseRent * WEIGHTS.walkScore * walkModifier,
    age: baseRent * WEIGHTS.propertyAge * propertyAgeModifier,
    amenities: (factors.amenitiesCount * 25), // Each amenity adds $25 weighted by amenities factor
    squareFootage: (factors.squareFeet - 800) * 0.1 // $0.10 per sq ft difference from 800 baseline
  }

  // Apply all adjustments
  const adjustedRent = baseRent +
    adjustments.crime +
    adjustments.walkability +
    adjustments.age +
    (adjustments.amenities * WEIGHTS.amenities) +
    (adjustments.squareFootage * WEIGHTS.squareFootage)

  // Calculate confidence score (0-100)
  const confidence = calculateConfidenceScore(factors)

  // Create a range around the adjusted rent
  const range = adjustedRent * 0.1 // 10% range
  return {
    minRent: Math.round(adjustedRent - range),
    maxRent: Math.round(adjustedRent + range),
    confidence
  }
}

function calculateConfidenceScore(factors: RentFactors): number {
  // Base confidence starts at 100
  let confidence = 100

  // Reduce confidence based on various factors
  if (factors.comparableMedianRent === 0) confidence -= 40  // No comps is a big problem
  if (factors.crimeIndex === 0) confidence -= 10            // Missing crime data
  if (factors.walkScore === 0) confidence -= 5             // Missing walk score
  if (factors.schoolScore === 0) confidence -= 5           // Missing school data

  // Adjust confidence based on number of amenities (more amenities = more variables = slightly less confidence)
  confidence -= Math.max(0, factors.amenitiesCount - 5) * 2

  // Ensure confidence stays between 0 and 100
  return Math.max(0, Math.min(100, confidence))
} 
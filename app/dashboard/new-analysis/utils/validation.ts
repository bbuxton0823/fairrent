import type { PropertyFormData } from '../types'

interface ValidationResult {
  isValid: boolean
  errors: Record<string, string>
}

export function validateStep1(data: Partial<PropertyFormData>): ValidationResult {
  const errors: Record<string, string> = {}

  // Required fields
  if (!data.address?.trim()) {
    errors.address = 'Property address is required'
  }

  if (!data.propertyType) {
    errors.propertyType = 'Property type is required'
  }

  if (!data.beds) {
    errors.beds = 'Number of bedrooms is required'
  } else if (isNaN(Number(data.beds)) || Number(data.beds) < 0) {
    errors.beds = 'Please enter a valid number of bedrooms'
  }

  if (!data.fullBaths) {
    errors.fullBaths = 'Number of full bathrooms is required'
  } else if (isNaN(Number(data.fullBaths)) || Number(data.fullBaths) < 0) {
    errors.fullBaths = 'Please enter a valid number of bathrooms'
  }

  if (data.halfBaths && (isNaN(Number(data.halfBaths)) || Number(data.halfBaths) < 0)) {
    errors.halfBaths = 'Please enter a valid number of half bathrooms'
  }

  if (!data.squareFeet) {
    errors.squareFeet = 'Square footage is required'
  } else if (isNaN(Number(data.squareFeet)) || Number(data.squareFeet) < 100) {
    errors.squareFeet = 'Please enter a valid square footage (minimum 100)'
  }

  if (!data.yearBuilt) {
    errors.yearBuilt = 'Year built is required'
  } else {
    const year = Number(data.yearBuilt)
    const currentYear = new Date().getFullYear()
    if (isNaN(year) || year < 1800 || year > currentYear) {
      errors.yearBuilt = `Please enter a valid year between 1800 and ${currentYear}`
    }
  }

  if (!data.requestedRent) {
    errors.requestedRent = 'Requested rent is required'
  } else if (isNaN(Number(data.requestedRent)) || Number(data.requestedRent) <= 0) {
    errors.requestedRent = 'Please enter a valid rent amount'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

export function validateStep2(data: Partial<PropertyFormData>): ValidationResult {
  const errors: Record<string, string> = {}

  // Check utilities
  if (!data.utilities) {
    errors.utilities = 'Utility information is required'
  } else {
    const requiredUtilities = ['heatingFuel', 'cookingFuel', 'hotWater', 'water', 'sewer']
    requiredUtilities.forEach((utility) => {
      const info = data.utilities?.[utility]
      if (!info?.type) {
        errors[`${utility}Type`] = `${utility.replace(/([A-Z])/g, ' $1').toLowerCase()} type is required`
      }
      if (!info?.paidBy) {
        errors[`${utility}PaidBy`] = `Please specify who pays for ${utility.replace(
          /([A-Z])/g,
          ' $1'
        ).toLowerCase()}`
      }
    })
  }

  // Check parking
  if (!data.parking) {
    errors.parking = 'Parking information is required'
  }

  // Property condition is required
  if (!data.propertyCondition) {
    errors.propertyCondition = 'Property condition is required'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

export function validateStep3(data: Partial<PropertyFormData>): ValidationResult {
  const errors: Record<string, string> = {}

  // Check if location data exists
  if (!data.coordinates) {
    errors.coordinates = 'Property location is required'
  } else {
    if (typeof data.coordinates.lat !== 'number' || isNaN(data.coordinates.lat)) {
      errors.latitude = 'Valid latitude is required'
    }
    if (typeof data.coordinates.lng !== 'number' || isNaN(data.coordinates.lng)) {
      errors.longitude = 'Valid longitude is required'
    }
  }

  // Check if neighborhood data was fetched
  if (!data.neighborhoodData) {
    errors.neighborhoodData = 'Neighborhood analysis is required'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

export function validateAllSteps(data: Partial<PropertyFormData>): ValidationResult {
  const step1Result = validateStep1(data)
  const step2Result = validateStep2(data)
  const step3Result = validateStep3(data)

  return {
    isValid: step1Result.isValid && step2Result.isValid && step3Result.isValid,
    errors: {
      ...step1Result.errors,
      ...step2Result.errors,
      ...step3Result.errors,
    },
  }
} 
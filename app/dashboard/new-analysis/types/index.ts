export interface PropertyInfo {
  address: string
  propertyType: string
  bedrooms: string
  bathrooms: string
  squareFeet: string
  yearBuilt: string
}

export interface UtilityInfo {
  type: string
  paidBy: string
}

export interface Utilities {
  [key: string]: UtilityInfo
}

export interface PropertyFormData {
  // Step 1: Property Details
  address?: string
  unitNumber?: string
  beds?: string
  fullBaths?: string
  halfBaths?: string
  squareFeet?: string
  yearBuilt?: string
  propertyType?: string
  quality?: string
  utilitySchedule?: string
  requestedRent?: string

  // Step 2: Amenities & Utilities
  amenities?: string[]
  propertyCondition?: string
  parking?: string
  utilities?: Utilities

  // Step 3: Location
  coordinates?: {
    lat: number
    lng: number
  }
  neighborhoodData?: {
    crimeIndex: number
    schoolScore: number
    walkScore: number
    medianRent: number
    rentEstimate: {
      minRent: number
      maxRent: number
      confidence: number
    }
    demographics: {
      population: number
      medianAge: number
      medianIncome: number
    }
    comparableProperties: Array<{
      address: string
      rent: number
      bedrooms: number
      bathrooms: number
      squareFeet: number
    }>
  }
} 
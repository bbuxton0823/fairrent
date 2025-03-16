export interface UtilityInfo {
  type: string
  paidBy: string
}

export interface Utilities {
  [key: string]: UtilityInfo
}

export interface RentEstimate {
  minRent: number
  maxRent: number
  confidence: number
}

export interface NeighborhoodData {
  rentEstimate: RentEstimate
  crimeIndex?: number
  schoolScore?: number
  walkScore?: number
  medianRent?: number
  demographics?: {
    population: number
    medianAge: number
    medianIncome: number
  }
  comparableProperties?: Array<{
    address: string
    rent: number
    bedrooms: number
    bathrooms: number
    squareFeet: number
  }>
}

export interface PropertyFormData {
  analysisId?: string
  address?: string
  unitNumber?: string
  beds?: string
  baths?: string
  fullBaths?: string
  halfBaths?: string
  squareFeet?: string
  yearBuilt?: string
  propertyType?: string
  quality?: 'luxury' | 'high' | 'medium' | 'low'
  utilitySchedule?: string
  requestedRent?: string
  amenities?: string[]
  propertyCondition?: 'excellent' | 'good' | 'fair' | 'poor'
  parking?: string
  utilities?: Utilities
  coordinates?: {
    lat: number
    lng: number
  }
  neighborhoodData?: Partial<NeighborhoodData>
} 
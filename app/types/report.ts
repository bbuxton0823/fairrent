export interface PropertyReport {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'completed';
  
  // Property Details
  propertyDetails: {
    address: string;
    unit: string;
    beds: number;
    fullBaths: number;
    halfBaths: number;
    sqft: number;
    yearBuilt: string;
    propertyType: string;
    requestedRent: number;
    leaseType: string;
    isRenovated: boolean;
  };
  
  // Amenities & Utilities
  amenities: {
    features: string[];
    propertyCondition: string;
    parking: string;
    utilities: {
      [key: string]: {
        type: string;
        paidBy: 'Owner' | 'Tenant';
      };
    };
  };
  
  // Location Analysis
  location: {
    zipCode: string;
    neighborhoodScore: number;
    metrics: {
      crimeRate?: number;
      medianIncome?: number;
      populationDensity?: number;
      schoolRating?: number;
      employmentRate?: number;
    };
  };
  
  // Market Analysis
  marketAnalysis: {
    comparableProperties: Array<{
      address: string;
      rent: number;
      beds: number;
      baths: number;
      sqft: number;
      distance: number;
    }>;
    medianRent: number;
    rentRange: {
      min: number;
      max: number;
    };
    pricePerSqft: number;
  };
  
  // Financial Analysis
  financialAnalysis: {
    estimatedMonthlyRevenue: number;
    estimatedMonthlyExpenses: {
      utilities: number;
      maintenance: number;
      propertyTax: number;
      insurance: number;
      other: number;
    };
    netOperatingIncome: number;
    capRate: number;
    cashOnCashReturn: number;
  };
  
  // Recommendations
  recommendations: {
    suggestedRent: number;
    confidenceScore: number;
    notes: string[];
  };
} 
export interface PropertyReport {
  propertyDetails: {
    address: string;
    unit: string;
    beds: string;
    fullBaths: string;
    sqft: string;
  };
  location: {
    neighborhoodScore: number;
  };
  marketAnalysis: {
    medianRent: number;
    pricePerSqft: number;
  };
  recommendations: {
    suggestedRent: number;
  };
  financialAnalysis: {
    estimatedMonthlyRevenue: number;
    estimatedMonthlyExpenses: {
      [key: string]: number;
    };
  };
} 
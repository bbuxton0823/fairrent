import { cache } from 'react';

interface CrimeData {
  crimeRate: number;
  violentCrime: number;
  propertyCrime: number;
  safetyIndex: number;
}

interface CensusData {
  medianIncome: number;
  populationDensity: number;
  schoolRating: number;
  employmentRate: number;
  medianHomeValue: number;
  medianRent: number;
}

interface NeighborhoodMetrics extends CrimeData, CensusData {
  // Any additional properties specific to NeighborhoodMetrics
  walkabilityScore?: number;
  transitScore?: number;
}

// Cache interface
interface CacheData {
  timestamp: number;
  data: any;
}

// Cache duration (24 hours in milliseconds)
const CACHE_DURATION = 24 * 60 * 60 * 1000;

// In-memory cache object
const apiCache: { [key: string]: CacheData } = {};

// Refined weights for more accurate scoring
const NEIGHBORHOOD_WEIGHTS = {
  crimeRate: 0.30,        // Increased weight for safety
  safetyIndex: 0.20,      // Added more emphasis on overall safety
  medianIncome: 0.12,     // Slightly reduced
  schoolRating: 0.15,     // Maintained importance of education
  employmentRate: 0.10,   // Slightly reduced
  populationDensity: 0.03,// Minimal impact
  medianHomeValue: 0.10   // Indicator of neighborhood stability
};

// Cache wrapper function
function withCache<T>(key: string, fetchFn: () => Promise<T>): Promise<T> {
  const cached = apiCache[key];
  const now = Date.now();

  if (cached && (now - cached.timestamp) < CACHE_DURATION) {
    console.log(`Cache hit for ${key}`);
    return Promise.resolve(cached.data);
  }

  return fetchFn().then(data => {
    apiCache[key] = {
      timestamp: now,
      data
    };
    console.log(`Cache miss for ${key}, storing new data`);
    return data;
  });
}

export async function fetchCrimeData(zipCode: string): Promise<CrimeData> {
  const API_KEY = process.env.NEXT_PUBLIC_FBI_CRIME_API_KEY;
  const API_ENDPOINT = process.env.NEXT_PUBLIC_FBI_CRIME_API_ENDPOINT;
  
  const response = await fetch(
    `${API_ENDPOINT}/${zipCode}`,
    {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch crime data');
  }
  
  return response.json();
}

export async function fetchCensusData(zipCode: string): Promise<CensusData> {
  const API_KEY = process.env.NEXT_PUBLIC_CENSUS_API_KEY;
  const API_ENDPOINT = process.env.NEXT_PUBLIC_CENSUS_API_ENDPOINT;
  
  const response = await fetch(
    `${API_ENDPOINT}/${zipCode}`,
    {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch census data');
  }
  
  return response.json();
}

function calculateNeighborhoodScore(metrics: NeighborhoodMetrics): number {
  let score = 0;
  
  // Enhanced Safety Score (0-10)
  if (metrics.crimeRate && metrics.safetyIndex) {
    const crimeScore = 10 - (metrics.crimeRate / 10);
    const safetyScore = metrics.safetyIndex;
    score += (crimeScore * NEIGHBORHOOD_WEIGHTS.crimeRate) + 
             (safetyScore * NEIGHBORHOOD_WEIGHTS.safetyIndex);
  }
  
  // Refined Income Score (0-10)
  if (metrics.medianIncome) {
    // More nuanced income scoring
    const baseIncomeScore = Math.min(metrics.medianIncome / 10000, 10);
    const adjustedIncomeScore = Math.log10(baseIncomeScore + 1) * 10;
    score += adjustedIncomeScore * NEIGHBORHOOD_WEIGHTS.medianIncome;
  }
  
  // School Rating (0-10)
  if (metrics.schoolRating) {
    score += metrics.schoolRating * NEIGHBORHOOD_WEIGHTS.schoolRating;
  }
  
  // Employment Score with diminishing returns
  if (metrics.employmentRate) {
    const employmentScore = Math.sqrt(metrics.employmentRate) * 10;
    score += (employmentScore / 10) * NEIGHBORHOOD_WEIGHTS.employmentRate;
  }
  
  // Population Density (inverse relationship)
  if (metrics.populationDensity) {
    const densityScore = 10 - Math.min(metrics.populationDensity / 10000, 10);
    score += densityScore * NEIGHBORHOOD_WEIGHTS.populationDensity;
  }
  
  // Home Value Score with market consideration
  if (metrics.medianHomeValue) {
    const marketAdjustedScore = Math.min(
      (metrics.medianHomeValue / metrics.medianRent) / 200, 
      10
    );
    score += marketAdjustedScore * NEIGHBORHOOD_WEIGHTS.medianHomeValue;
  }

  // Ensure score is between 1-10 with one decimal place
  return Math.round(Math.min(Math.max(score, 1), 10) * 10) / 10;
}

export { calculateNeighborhoodScore, NEIGHBORHOOD_WEIGHTS }; 
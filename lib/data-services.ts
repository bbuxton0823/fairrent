// Mock implementations of data services
// These would typically call real APIs in production

export async function getCrimeData(zipCode: string) {
  // Mock crime data
  return {
    data: Array(Math.floor(Math.random() * 100)).fill(null) // Random number of incidents
  };
}

export async function getRentalData(zipCode: string) {
  // Mock rental data [medianRent, medianHomeValue]
  return [
    (1500 + Math.random() * 1000).toFixed(0), // Random rent between 1500-2500
    (300000 + Math.random() * 200000).toFixed(0) // Random home value between 300k-500k
  ];
}

export async function getEconomicEducationData(zipCode: string) {
  // Mock economic data [income, education, unemployment]
  return [
    (60000 + Math.random() * 40000).toFixed(0), // Random income between 60k-100k
    (5000 + Math.random() * 5000).toFixed(0), // Random education metric
    (200 + Math.random() * 800).toFixed(0) // Random unemployment number
  ];
}

export async function getServicesData(zipCode: string) {
  // Mock services data [businessDensity]
  return [
    (20000 + Math.random() * 30000).toFixed(0) // Random business density
  ];
}

export async function getDemographicsData(zipCode: string) {
  // Mock demographics data [population, diversity]
  return [
    (20000 + Math.random() * 80000).toFixed(0), // Random population between 20k-100k
    (5000 + Math.random() * 5000).toFixed(0) // Random diversity metric
  ];
} 
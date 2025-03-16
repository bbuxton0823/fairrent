'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface RentalSource {
  name: string;
  averageRent: number;
  rentRange: {
    min: number;
    max: number;
  };
  lastUpdated: string;
}

interface MarketComparisonProps {
  propertyData: {
    zipCode: string;
    desiredMonthlyRent: string;
    propertyType: string;
    amenities: Record<string, boolean>;
  };
  onPrevious: () => void;
  onFinish: () => void;
}

export default function MarketComparison({ propertyData, onPrevious, onFinish }: MarketComparisonProps) {
  const [analysis, setAnalysis] = useState({
    sources: [] as RentalSource[],
    aggregateData: {
      averageRent: 0,
      rentRange: { min: 0, max: 0 },
      confidence: 0
    },
    recommendation: {
      status: '',
      message: '',
      recommendation: ''
    },
    loading: true,
    error: null as string | null
  });

  useEffect(() => {
    fetchRentalData();
  }, []);

  const fetchRentalData = async () => {
    try {
      // Fetch data from multiple sources
      const [zillow, realtor, rentometer] = await Promise.all([
        fetch(`/api/rental-data/zillow?zipCode=${propertyData.zipCode}`),
        fetch(`/api/rental-data/realtor?zipCode=${propertyData.zipCode}`),
        fetch(`/api/rental-data/rentometer?zipCode=${propertyData.zipCode}`)
      ]);

      const [zillowData, realtorData, rentometerData] = await Promise.all([
        zillow.json(),
        realtor.json(),
        rentometer.json()
      ]);

      const sources = [
        {
          name: 'Zillow',
          ...zillowData
        },
        {
          name: 'Realtor.com',
          ...realtorData
        },
        {
          name: 'Rentometer',
          ...rentometerData
        }
      ];

      // Calculate aggregate data
      const aggregateData = calculateAggregateData(sources);
      const recommendation = generateRecommendation(
        Number(propertyData.desiredMonthlyRent),
        aggregateData
      );

      setAnalysis({
        sources,
        aggregateData,
        recommendation,
        loading: false,
        error: null
      });

    } catch (error) {
      setAnalysis(prev => ({
        ...prev,
        loading: false,
        error: "Failed to fetch rental market data. Please try again."
      }));
    }
  };

  const calculateAggregateData = (sources: RentalSource[]) => {
    const validSources = sources.filter(source => source.averageRent > 0);
    
    const averageRent = Math.round(
      validSources.reduce((sum, source) => sum + source.averageRent, 0) / validSources.length
    );

    const allMins = validSources.map(source => source.rentRange.min);
    const allMaxs = validSources.map(source => source.rentRange.max);
    
    return {
      averageRent,
      rentRange: {
        min: Math.round(Math.min(...allMins)),
        max: Math.round(Math.max(...allMaxs))
      },
      confidence: calculateConfidence(validSources)
    };
  };

  const generateRecommendation = (
    desiredRent: number,
    aggregateData: {
      averageRent: number;
      rentRange: { min: number; max: number };
      confidence: number;
    }
  ): {
    status: string;
    message: string;
    recommendation: string;
  } => {
    const { averageRent, rentRange } = aggregateData;
    
    if (desiredRent < rentRange.min) {
      return {
        status: 'low',
        message: `Your desired rent of $${desiredRent} is below the market range of $${rentRange.min} - $${rentRange.max}.`,
        recommendation: `Consider increasing to at least $${rentRange.min} to match market rates.`
      };
    } else if (desiredRent > rentRange.max) {
      return {
        status: 'high',
        message: `Your desired rent of $${desiredRent} is above the market range of $${rentRange.min} - $${rentRange.max}.`,
        recommendation: `Consider decreasing to at most $${rentRange.max} to remain competitive.`
      };
    } else {
      const percentile = (desiredRent - rentRange.min) / (rentRange.max - rentRange.min);
      const position = percentile < 0.33 ? 'lower' : percentile < 0.66 ? 'middle' : 'upper';
      
      return {
        status: 'good',
        message: `Your desired rent of $${desiredRent} is within the ${position} part of the market range ($${rentRange.min} - $${rentRange.max}).`,
        recommendation: 'This is a competitive price for your property.'
      };
    }
  };

  const calculateConfidence = (sources: RentalSource[]) => {
    // Calculate confidence based on data consistency between sources
    const rentVariance = sources.map(s => s.averageRent).reduce((acc, curr) => {
      return acc + Math.pow(curr - analysis.aggregateData.averageRent, 2);
    }, 0) / sources.length;
    
    return Math.min(100, Math.max(0, 100 - (rentVariance / 100)));
  };

  if (analysis.loading) {
    return (
      <div className="bg-gray-900 p-6 rounded-lg">
        <div className="flex flex-col items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="text-white mt-4">Gathering rental market data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 p-6 rounded-lg">
      <h2 className="text-2xl font-bold text-white mb-6">Market Analysis</h2>

      {analysis.error ? (
        <div className="bg-red-900/50 text-red-200 p-4 rounded-lg mb-6">
          {analysis.error}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Rent Comparison */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 p-4 rounded-lg"
          >
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <h3 className="text-gray-400 mb-1">Your Desired Rent</h3>
                <p className="text-2xl text-white">${propertyData.desiredMonthlyRent}</p>
              </div>
              <div>
                <h3 className="text-gray-400 mb-1">Market Average</h3>
                <p className="text-2xl text-white">${analysis.aggregateData.averageRent}</p>
              </div>
            </div>
            <div className="bg-gray-900/50 p-3 rounded">
              <p className="text-gray-300">
                Market Range: ${analysis.aggregateData.rentRange.min} - ${analysis.aggregateData.rentRange.max}
              </p>
            </div>
          </motion.div>

          {/* Data Sources */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800 p-4 rounded-lg"
          >
            <h3 className="text-lg font-semibold text-white mb-3">Source Data</h3>
            <div className="space-y-3">
              {analysis.sources.map((source, index) => (
                <div key={source.name} className="bg-gray-900/50 p-3 rounded">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">{source.name}</span>
                    <span className="text-white">${source.averageRent}</span>
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    Range: ${source.rentRange.min} - ${source.rentRange.max}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recommendation */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-blue-900/30 p-4 rounded-lg"
          >
            <h3 className="text-lg font-semibold text-white mb-2">Recommendation</h3>
            <p className="text-gray-300">{analysis.recommendation.recommendation}</p>
            <div className="mt-2 text-sm text-gray-400">
              Confidence Score: {analysis.aggregateData.confidence.toFixed(1)}%
            </div>
          </motion.div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6">
        <button
          type="button"
          onClick={onPrevious}
          className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors duration-200"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={onFinish}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
        >
          Finish
        </button>
      </div>
    </div>
  );
} 
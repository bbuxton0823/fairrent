'use client';

import { useState, useEffect } from 'react';

/**
 * Rent Analysis Result Component
 * 
 * Displays the results of a rent analysis.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.propertyData - The property data
 * @returns {JSX.Element} The component
 */
export default function RentAnalysisResult({ propertyData }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  
  useEffect(() => {
    // Skip if no property data
    if (!propertyData) return;
    
    async function fetchAnalysis() {
      setLoading(true);
      setError(null);
      
      try {
        // Call the API route
        const response = await fetch('/api/rent-analysis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(propertyData)
        });
        
        // Parse the response
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || data.error || 'Failed to generate analysis');
        }
        
        // Set the analysis
        setAnalysis(data.data);
      } catch (error) {
        console.error('Error fetching analysis:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchAnalysis();
  }, [propertyData]);
  
  // Render loading state
  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <div className="p-6 bg-red-50 rounded-lg shadow-md border border-red-200">
        <h3 className="text-lg font-semibold text-red-700">Error</h3>
        <p className="text-red-600">{error}</p>
        <button 
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          onClick={() => fetchAnalysis()}
        >
          Try Again
        </button>
      </div>
    );
  }
  
  // Render empty state
  if (!analysis) {
    return (
      <div className="p-6 bg-gray-50 rounded-lg shadow-md">
        <p className="text-gray-500">No analysis available. Please submit property details.</p>
      </div>
    );
  }
  
  // Parse the analysis text to extract key information
  const rentMatch = analysis.analysis.match(/RENT ESTIMATE: \$([\d,]+) - \$([\d,]+)/);
  const confidenceMatch = analysis.analysis.match(/CONFIDENCE SCORE: (\d+)\/100/);
  
  const minRent = rentMatch ? rentMatch[1] : null;
  const maxRent = rentMatch ? rentMatch[2] : null;
  const confidence = confidenceMatch ? confidenceMatch[1] : null;
  
  // Render analysis result
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Rent Analysis</h2>
        <div className="text-sm text-gray-500">
          Generated on {new Date(analysis.timestamp).toLocaleDateString()}
        </div>
      </div>
      
      {/* Rent Range */}
      {minRent && maxRent && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700">Recommended Rent</h3>
          <div className="flex items-end mt-2">
            <span className="text-3xl font-bold text-green-600">${minRent} - ${maxRent}</span>
            <span className="ml-2 text-sm text-gray-500">per month</span>
          </div>
          {confidence && (
            <div className="mt-1 flex items-center">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-green-600 h-2.5 rounded-full" 
                  style={{ width: `${confidence}%` }}
                ></div>
              </div>
              <span className="ml-2 text-sm text-gray-600">{confidence}% confidence</span>
            </div>
          )}
        </div>
      )}
      
      {/* Full Analysis */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg whitespace-pre-line">
        {analysis.analysis}
      </div>
      
      {/* Property Details */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Property Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-gray-500">Address:</span>
            <span className="ml-2">{analysis.property.address}</span>
          </div>
          <div>
            <span className="text-gray-500">Type:</span>
            <span className="ml-2">{analysis.property.propertyType}</span>
          </div>
          <div>
            <span className="text-gray-500">Size:</span>
            <span className="ml-2">{analysis.property.squareFeet} sq ft</span>
          </div>
          <div>
            <span className="text-gray-500">Bedrooms:</span>
            <span className="ml-2">{analysis.property.beds}</span>
          </div>
          <div>
            <span className="text-gray-500">Bathrooms:</span>
            <span className="ml-2">
              {analysis.property.fullBaths} full, {analysis.property.halfBaths} half
            </span>
          </div>
          <div>
            <span className="text-gray-500">Year Built:</span>
            <span className="ml-2">{analysis.property.yearBuilt}</span>
          </div>
        </div>
      </div>
      
      {/* Usage Information */}
      <div className="mt-6 pt-4 border-t border-gray-200 text-xs text-gray-400">
        <p>AI-generated content • Token usage: {analysis.usage?.total_tokens || 'N/A'}</p>
      </div>
    </div>
  );
} 
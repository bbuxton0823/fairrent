/**
 * Example Next.js API Route Integration
 * 
 * This file demonstrates how to integrate the AI utilities
 * into a Next.js API route for the FairRent application.
 * 
 * Path: /app/api/rent-analysis/route.js
 */

import { NextResponse } from 'next/server';
import { generateRentAnalysis } from '../../../doc/ai_utils';

/**
 * API route handler for rent analysis
 * 
 * This route accepts property data and returns a rent analysis.
 * 
 * @param {Request} request - The incoming request
 * @returns {Promise<NextResponse>} The API response
 */
export async function POST(request) {
  try {
    // Parse the request body
    const propertyData = await request.json();
    
    // Validate required fields
    const requiredFields = [
      'address', 'propertyType', 'squareFeet', 
      'beds', 'fullBaths', 'yearBuilt'
    ];
    
    const missingFields = requiredFields.filter(field => !propertyData[field]);
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }
    
    // Set default values for optional fields
    const propertyDataWithDefaults = {
      halfBaths: 0,
      quality: 'Average',
      amenities: '',
      neighborhood: '',
      ...propertyData
    };
    
    // Generate the rent analysis
    const analysis = await generateRentAnalysis(propertyDataWithDefaults);
    
    // Return the analysis
    return NextResponse.json({
      success: true,
      data: {
        analysis: analysis.analysis,
        timestamp: analysis.timestamp,
        property: propertyDataWithDefaults
      }
    });
  } catch (error) {
    console.error('Error generating rent analysis:', error);
    
    // Return an error response
    return NextResponse.json(
      { 
        error: 'Failed to generate rent analysis',
        message: error.message 
      },
      { status: 500 }
    );
  }
}

/**
 * Example Next.js API Route Integration
 * 
 * Path: /app/api/rent-compliance/route.js
 */

import { NextResponse } from 'next/server';
import { checkRentCompliance } from '../../../doc/ai_utils';

/**
 * API route handler for rent compliance check
 * 
 * This route accepts rent data and returns a compliance check.
 * 
 * @param {Request} request - The incoming request
 * @returns {Promise<NextResponse>} The API response
 */
export async function POST(request) {
  try {
    // Parse the request body
    const rentData = await request.json();
    
    // Validate required fields
    const requiredFields = [
      'zipCode', 'currentRent', 'proposedRent', 
      'lastIncreaseDate', 'tenantYears'
    ];
    
    const missingFields = requiredFields.filter(field => !rentData[field]);
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }
    
    // Check rent compliance
    const compliance = await checkRentCompliance(rentData);
    
    // Return the compliance check
    return NextResponse.json({
      success: true,
      data: {
        compliance: compliance.compliance,
        timestamp: compliance.timestamp,
        rentData
      }
    });
  } catch (error) {
    console.error('Error checking rent compliance:', error);
    
    // Return an error response
    return NextResponse.json(
      { 
        error: 'Failed to check rent compliance',
        message: error.message 
      },
      { status: 500 }
    );
  }
}

/**
 * Example React Component Integration
 * 
 * This example shows how to use the AI-generated content in a React component.
 * 
 * Path: /app/dashboard/analysis/components/RentAnalysisResult.jsx
 */

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
          throw new Error(data.message || 'Failed to generate analysis');
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
    </div>
  );
} 
'use client';

import { useState, useEffect } from 'react';

/**
 * Rent Compliance Result Component
 * 
 * Displays the results of a rent compliance check.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.rentData - The rent data
 * @returns {JSX.Element} The component
 */
export default function RentComplianceResult({ rentData }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [compliance, setCompliance] = useState(null);
  
  useEffect(() => {
    // Skip if no rent data
    if (!rentData) return;
    
    async function fetchCompliance() {
      setLoading(true);
      setError(null);
      
      try {
        // Call the API route
        const response = await fetch('/api/rent-compliance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(rentData)
        });
        
        // Parse the response
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || data.error || 'Failed to check compliance');
        }
        
        // Set the compliance
        setCompliance(data.data);
      } catch (error) {
        console.error('Error fetching compliance:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchCompliance();
  }, [rentData]);
  
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
          onClick={() => fetchCompliance()}
        >
          Try Again
        </button>
      </div>
    );
  }
  
  // Render empty state
  if (!compliance) {
    return (
      <div className="p-6 bg-gray-50 rounded-lg shadow-md">
        <p className="text-gray-500">No compliance check available. Please submit rent details.</p>
      </div>
    );
  }
  
  // Check if the compliance is positive or negative
  const isCompliant = compliance.compliance.includes('✅ COMPLIANT') || 
                      compliance.compliance.includes('COMPLIANT') ||
                      !compliance.compliance.includes('NOT COMPLIANT');
  
  // Render compliance result
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Rent Compliance Check</h2>
        <div className="text-sm text-gray-500">
          Generated on {new Date(compliance.timestamp).toLocaleDateString()}
        </div>
      </div>
      
      {/* Compliance Status */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700">Compliance Status</h3>
        <div className={`mt-2 p-3 rounded-lg ${isCompliant ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <div className="flex items-center">
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isCompliant ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
              {isCompliant ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <h3 className={`text-sm font-medium ${isCompliant ? 'text-green-800' : 'text-red-800'}`}>
                {isCompliant ? 'Compliant' : 'Not Compliant'}
              </h3>
              <div className={`text-sm ${isCompliant ? 'text-green-700' : 'text-red-700'}`}>
                {isCompliant 
                  ? 'The proposed rent increase complies with applicable regulations.' 
                  : 'The proposed rent increase does not comply with applicable regulations.'}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Full Compliance Analysis */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg whitespace-pre-line">
        {compliance.compliance}
      </div>
      
      {/* Rent Details */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Rent Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-gray-500">ZIP Code:</span>
            <span className="ml-2">{compliance.rentData.zipCode}</span>
          </div>
          <div>
            <span className="text-gray-500">Current Rent:</span>
            <span className="ml-2">${compliance.rentData.currentRent}</span>
          </div>
          <div>
            <span className="text-gray-500">Proposed Rent:</span>
            <span className="ml-2">${compliance.rentData.proposedRent}</span>
          </div>
          <div>
            <span className="text-gray-500">Increase Amount:</span>
            <span className="ml-2">${compliance.rentData.proposedRent - compliance.rentData.currentRent}</span>
          </div>
          <div>
            <span className="text-gray-500">Increase Percentage:</span>
            <span className="ml-2">
              {((compliance.rentData.proposedRent - compliance.rentData.currentRent) / compliance.rentData.currentRent * 100).toFixed(1)}%
            </span>
          </div>
          <div>
            <span className="text-gray-500">Last Increase:</span>
            <span className="ml-2">{new Date(compliance.rentData.lastIncreaseDate).toLocaleDateString()}</span>
          </div>
          <div>
            <span className="text-gray-500">Tenant Duration:</span>
            <span className="ml-2">{compliance.rentData.tenantYears} years</span>
          </div>
        </div>
      </div>
      
      {/* Usage Information */}
      <div className="mt-6 pt-4 border-t border-gray-200 text-xs text-gray-400">
        <p>AI-generated content • Token usage: {compliance.usage?.total_tokens || 'N/A'}</p>
      </div>
    </div>
  );
} 
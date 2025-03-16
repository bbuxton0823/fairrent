'use client';

import { useState, useEffect } from 'react';

/**
 * Property Description Result Component
 * 
 * Displays the results of a property description generation.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.propertyData - The property data
 * @param {string} props.targetMarket - The target market
 * @param {string} props.uniqueFeatures - The unique features
 * @returns {JSX.Element} The component
 */
export default function PropertyDescriptionResult({ propertyData, targetMarket, uniqueFeatures }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [description, setDescription] = useState(null);
  
  useEffect(() => {
    // Skip if no property data
    if (!propertyData || !targetMarket || !uniqueFeatures) return;
    
    async function fetchDescription() {
      setLoading(true);
      setError(null);
      
      try {
        // Prepare the request data
        const requestData = {
          propertyDetails: typeof propertyData === 'string' 
            ? propertyData 
            : JSON.stringify(propertyData),
          targetMarket,
          uniqueFeatures
        };
        
        // Call the API route
        const response = await fetch('/api/property-description', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestData)
        });
        
        // Parse the response
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || data.error || 'Failed to generate description');
        }
        
        // Set the description
        setDescription(data.data);
      } catch (error) {
        console.error('Error fetching description:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchDescription();
  }, [propertyData, targetMarket, uniqueFeatures]);
  
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
          onClick={() => fetchDescription()}
        >
          Try Again
        </button>
      </div>
    );
  }
  
  // Render empty state
  if (!description) {
    return (
      <div className="p-6 bg-gray-50 rounded-lg shadow-md">
        <p className="text-gray-500">No description available. Please submit property details.</p>
      </div>
    );
  }
  
  // Extract title from description (assuming it's the first line)
  const lines = description.description.trim().split('\n');
  const title = lines[0];
  const body = lines.slice(1).join('\n').trim();
  
  // Render description result
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Property Description</h2>
        <div className="text-sm text-gray-500">
          Generated on {new Date(description.timestamp).toLocaleDateString()}
        </div>
      </div>
      
      {/* Description Title */}
      {title && (
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-700">{title}</h3>
        </div>
      )}
      
      {/* Description Body */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg whitespace-pre-line">
        {body}
      </div>
      
      {/* Copy Button */}
      <div className="mt-4 flex justify-end">
        <button 
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
          onClick={() => {
            navigator.clipboard.writeText(description.description);
            alert('Description copied to clipboard!');
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
            <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
          </svg>
          Copy to Clipboard
        </button>
      </div>
      
      {/* Input Details */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Input Details</h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <span className="text-gray-500">Target Market:</span>
            <span className="ml-2">{targetMarket}</span>
          </div>
          <div>
            <span className="text-gray-500">Unique Features:</span>
            <span className="ml-2">{uniqueFeatures}</span>
          </div>
        </div>
      </div>
      
      {/* Usage Information */}
      <div className="mt-6 pt-4 border-t border-gray-200 text-xs text-gray-400">
        <p>AI-generated content • Token usage: {description.usage?.total_tokens || 'N/A'}</p>
      </div>
    </div>
  );
} 
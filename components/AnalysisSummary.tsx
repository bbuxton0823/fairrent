'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface FormData {
  address: string;
  propertyType: string;
  bedrooms: string;
  fullBaths: string;
  halfBaths?: string;
  squareFootage: string;
  yearBuilt: string;
  requestedRent: string;
  leaseType: string;
  isRenovated?: boolean;
  condition?: string;
  parking?: string;
  amenities?: string[];
  utilities?: {
    [key: string]: {
      type: string;
      paidBy: string;
    };
  };
  zipCode?: string;
  neighborhoodScore?: string;
}

interface AnalysisSummaryProps {
  formData: FormData;
  onPrevious: () => void;
}

export default function AnalysisSummary({ formData, onPrevious }: AnalysisSummaryProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // First, create the report
      const reportResponse = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          propertyDetails: {
            address: formData.address,
            propertyType: formData.propertyType,
            beds: parseInt(formData.bedrooms),
            fullBaths: parseInt(formData.fullBaths),
            halfBaths: parseInt(formData.halfBaths || '0'),
            sqft: parseInt(formData.squareFootage),
            yearBuilt: formData.yearBuilt,
            requestedRent: parseFloat(formData.requestedRent),
            leaseType: formData.leaseType,
            isRenovated: formData.isRenovated || false
          },
          amenities: {
            features: formData.amenities || [],
            propertyCondition: formData.condition,
            parking: formData.parking,
            utilities: formData.utilities
          },
          location: {
            zipCode: formData.zipCode,
            neighborhoodScore: parseFloat(formData.neighborhoodScore || '0')
          }
        }),
      });

      if (!reportResponse.ok) {
        throw new Error('Failed to create report');
      }

      const reportData = await reportResponse.json();
      
      if (!reportData.reportId) {
        throw new Error('No report ID received');
      }

      // Redirect to the report page
      router.push(`/dashboard/reports/${reportData.reportId}`);
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'Failed to create report');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-black rounded-lg p-6">
      <h2 className="text-xl font-bold text-white mb-4">Analysis Summary</h2>
      <p className="text-gray-400 mb-6">
        Review your information before generating the analysis
      </p>

      {error && (
        <div className="bg-red-500/10 border border-red-500 rounded-md p-4 mb-6">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Property Details Summary */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-2">Property Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400">Address:</p>
              <p className="text-white">{formData.address}</p>
            </div>
            <div>
              <p className="text-gray-400">Property Type:</p>
              <p className="text-white">{formData.propertyType}</p>
            </div>
            <div>
              <p className="text-gray-400">Bedrooms:</p>
              <p className="text-white">{formData.bedrooms}</p>
            </div>
            <div>
              <p className="text-gray-400">Bathrooms:</p>
              <p className="text-white">{formData.fullBaths}</p>
            </div>
          </div>
        </div>

        {/* Utilities Summary */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-2">Utilities</h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(formData.utilities || {}).map(([key, value]: [string, any]) => (
              <div key={key}>
                <p className="text-gray-400">{key.replace(/([A-Z])/g, ' $1').trim()}:</p>
                <p className="text-white">
                  {value.type} - Paid by {value.paidBy}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={onPrevious}
          className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
        >
          Previous
        </button>
        <button
          onClick={handleAnalyze}
          className={`bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700
            ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? 'Analyzing...' : 'Analyze Property'}
        </button>
      </div>
    </div>
  );
} 
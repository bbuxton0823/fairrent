'use client';

import { useState } from 'react';

interface LocationFormData {
  zipCode: string;
  neighborhoodScore: string;
}

interface ValidationErrors {
  zipCode?: string;
}

export default function LocationDetailsForm({
  onNext,
  onBack,
  initialData
}: {
  onNext: (data: LocationFormData) => void;
  onBack: () => void;
  initialData?: LocationFormData;
}) {
  const [formData, setFormData] = useState<LocationFormData>(initialData || {
    zipCode: '',
    neighborhoodScore: ''
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Simple function to generate a score based on ZIP code
  const calculateNeighborhoodScore = (zipCode: string): number => {
    if (!zipCode || zipCode.length !== 5) return 0;
    // Simple algorithm: sum the digits and normalize to 1-10 range
    const sum = zipCode.split('').reduce((acc, digit) => acc + parseInt(digit), 0);
    return Math.max(1, Math.min(10, Math.round(sum / 4.5)));
  };

  const handleZipCodeChange = (zipCode: string) => {
    setFormData(prev => ({ 
      ...prev, 
      zipCode,
      neighborhoodScore: zipCode.length === 5 ? calculateNeighborhoodScore(zipCode).toString() : ''
    }));
    setFetchError(null);
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    
    if (!formData.zipCode) {
      newErrors.zipCode = 'ZIP code is required';
    } else if (!/^\d{5}$/.test(formData.zipCode)) {
      newErrors.zipCode = 'Please enter a valid 5-digit ZIP code';
    }

    // Ensure we have a neighborhood score
    if (!formData.neighborhoodScore) {
      newErrors.zipCode = 'Please wait for neighborhood score calculation';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext(formData);
    }
  };

  return (
    <div className="bg-black rounded-lg p-6">
      <h2 className="text-xl font-bold text-white mb-6">Location & Property Details</h2>
      
      <div className="space-y-6">
        {/* ZIP Code */}
        <div>
          <label className="block text-sm font-medium text-white mb-1">
            ZIP Code*
          </label>
          <input
            type="text"
            value={formData.zipCode}
            onChange={(e) => handleZipCodeChange(e.target.value)}
            className={`w-full bg-gray-800 text-white rounded-md p-2 ${
              errors.zipCode ? 'border border-red-500' : ''
            }`}
            placeholder="Enter ZIP code"
            maxLength={5}
          />
          {errors.zipCode && (
            <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>
          )}
        </div>

        {/* Neighborhood Score */}
        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Neighborhood Score
          </label>
          <div className="bg-gray-800 p-4 rounded-md">
            {formData.neighborhoodScore ? (
              <div className="text-2xl font-bold text-white">
                {formData.neighborhoodScore}/10
              </div>
            ) : (
              <div className="text-gray-400">
                Enter a ZIP code to see the neighborhood score
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2 text-white bg-gray-600 rounded-md hover:bg-gray-700"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          className={`bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 ${
            Object.keys(errors).length > 0 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={Object.keys(errors).length > 0}
        >
          Next
        </button>
      </div>
    </div>
  );
} 
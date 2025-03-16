'use client';

import { useState } from 'react';

interface PropertyFormData {
  address: string;
  unit: string;
  beds: string;
  fullBaths: string;
  halfBaths: string;
  sqft: string;
  yearBuilt: string;
  propertyType: string;
  utilitySchedule: string;
  requestedRent: string;
  leaseType: string;
  isRenovated: boolean;
}

interface ValidationErrors {
  address?: string;
  unit?: string;
  beds?: string;
  fullBaths?: string;
  halfBaths?: string;
  sqft?: string;
  yearBuilt?: string;
  propertyType?: string;
  utilitySchedule?: string;
  requestedRent?: string;
  leaseType?: string;
  isRenovated?: string;
  [key: string]: string | undefined;
}

export default function PropertyDetailsForm({ 
  onNext,
  onBack,
  initialData 
}: { 
  onNext: (data: PropertyFormData) => void;
  onBack?: () => void;
  initialData?: PropertyFormData;
}) {
  const [formData, setFormData] = useState<PropertyFormData>(initialData || {
    address: '',
    unit: '',
    beds: '',
    fullBaths: '',
    halfBaths: '0',
    sqft: '',
    yearBuilt: '',
    propertyType: '',
    utilitySchedule: '',
    requestedRent: '',
    leaseType: 'Standard (12 months)',
    isRenovated: false
  });

  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.beds || parseInt(formData.beds) < 1) {
      newErrors.beds = 'At least 1 bedroom is required';
    }

    if (!formData.fullBaths || parseInt(formData.fullBaths) < 1) {
      newErrors.fullBaths = 'At least 1 bathroom is required';
    }

    if (!formData.sqft || parseInt(formData.sqft) < 100) {
      newErrors.sqft = 'Valid square footage is required';
    }

    if (!formData.propertyType) {
      newErrors.propertyType = 'Property type is required';
    }

    if (!formData.requestedRent || parseFloat(formData.requestedRent) <= 0) {
      newErrors.requestedRent = 'Valid rent amount is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onNext(formData);
    }
  };

  const handleInputChange = (field: keyof PropertyFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error for this field if it exists
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <div className="bg-black rounded-lg p-6">
      <h2 className="text-xl font-bold text-white mb-6">Property Details</h2>
      
      <div className="space-y-6">
        {/* Address and Unit */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Address*
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className={`w-full bg-gray-800 text-white rounded-md p-2 ${
                errors.address ? 'border border-red-500' : ''
              }`}
              placeholder="Enter property address"
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Unit or Apt #
            </label>
            <input
              type="text"
              value={formData.unit}
              onChange={(e) => handleInputChange('unit', e.target.value)}
              className="w-full bg-gray-800 text-white rounded-md p-2"
              placeholder="Unit number"
            />
          </div>
        </div>

        {/* Property Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Beds*
            </label>
            <input
              type="number"
              min="1"
              value={formData.beds}
              onChange={(e) => handleInputChange('beds', e.target.value)}
              className={`w-full bg-gray-800 text-white rounded-md p-2 ${
                errors.beds ? 'border border-red-500' : ''
              }`}
            />
            {errors.beds && (
              <p className="text-red-500 text-sm mt-1">{errors.beds}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Full Baths*
            </label>
            <input
              type="number"
              min="1"
              value={formData.fullBaths}
              onChange={(e) => handleInputChange('fullBaths', e.target.value)}
              className={`w-full bg-gray-800 text-white rounded-md p-2 ${
                errors.fullBaths ? 'border border-red-500' : ''
              }`}
            />
            {errors.fullBaths && (
              <p className="text-red-500 text-sm mt-1">{errors.fullBaths}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Half Baths
            </label>
            <input
              type="number"
              min="0"
              value={formData.halfBaths}
              onChange={(e) => handleInputChange('halfBaths', e.target.value)}
              className={`w-full bg-gray-800 text-white rounded-md p-2 ${
                errors.halfBaths ? 'border border-red-500' : ''
              }`}
            />
            {errors.halfBaths && (
              <p className="text-red-500 text-sm mt-1">{errors.halfBaths}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Sqft
            </label>
            <input
              type="number"
              min="100"
              value={formData.sqft}
              onChange={(e) => handleInputChange('sqft', e.target.value)}
              className={`w-full bg-gray-800 text-white rounded-md p-2 ${
                errors.sqft ? 'border border-red-500' : ''
              }`}
              placeholder="Square footage"
            />
            {errors.sqft && (
              <p className="text-red-500 text-sm mt-1">{errors.sqft}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Year Built
            </label>
            <input
              type="text"
              value={formData.yearBuilt}
              onChange={(e) => handleInputChange('yearBuilt', e.target.value)}
              className={`w-full bg-gray-800 text-white rounded-md p-2 ${
                errors.yearBuilt ? 'border border-red-500' : ''
              }`}
              placeholder="YYYY"
            />
            {errors.yearBuilt && (
              <p className="text-red-500 text-sm mt-1">{errors.yearBuilt}</p>
            )}
          </div>
        </div>

        {/* Property Type and Utilities */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Property Type*
            </label>
            <select
              value={formData.propertyType}
              onChange={(e) => handleInputChange('propertyType', e.target.value)}
              className={`w-full bg-gray-800 text-white rounded-md p-2 ${
                errors.propertyType ? 'border border-red-500' : ''
              }`}
            >
              <option value="">Select type</option>
              <option value="single-family">Single Family</option>
              <option value="multi-family">Multi Family</option>
              <option value="condo">Condo</option>
              <option value="townhouse">Townhouse</option>
              <option value="apartment">Apartment</option>
            </select>
            {errors.propertyType && (
              <p className="text-red-500 text-sm mt-1">{errors.propertyType}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Utility Schedule*
            </label>
            <select
              value={formData.utilitySchedule}
              onChange={(e) => handleInputChange('utilitySchedule', e.target.value)}
              className={`w-full bg-gray-800 text-white rounded-md p-2 ${
                errors.utilitySchedule ? 'border border-red-500' : ''
              }`}
            >
              <option value="">Select utilities</option>
              <option value="none">None Included</option>
              <option value="some">Some Utilities</option>
              <option value="all">All Utilities</option>
            </select>
            {errors.utilitySchedule && (
              <p className="text-red-500 text-sm mt-1">{errors.utilitySchedule}</p>
            )}
          </div>
        </div>

        {/* Lease Type */}
        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Lease Type
          </label>
          <select
            value={formData.leaseType}
            onChange={(e) => handleInputChange('leaseType', e.target.value)}
            className={`w-full bg-gray-800 text-white rounded-md p-2 ${
              errors.leaseType ? 'border border-red-500' : ''
            }`}
          >
            <option value="">Select Lease Type</option>
            <option value="standard">Standard (12 months)</option>
            <option value="short">Short Term (&lt; 12 months)</option>
            <option value="long">Long Term (&gt; 12 months)</option>
          </select>
          {errors.leaseType && (
            <p className="text-red-500 text-sm mt-1">{errors.leaseType}</p>
          )}
        </div>

        {/* Renovation Status */}
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={formData.isRenovated}
            onChange={(e) => handleInputChange('isRenovated', e.target.checked)}
            className="h-4 w-4 text-blue-600 rounded"
          />
          <label className="ml-2 text-sm text-white">
            Has the property been renovated in the last 5 years?
          </label>
        </div>

        {/* Requested Rent */}
        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Requested Rent*
          </label>
          <div className="relative w-36">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-white">
              $
            </span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.requestedRent}
              onChange={(e) => handleInputChange('requestedRent', e.target.value)}
              className={`w-full bg-gray-800 text-white rounded-md p-2 pl-7 ${
                errors.requestedRent ? 'border border-red-500' : ''
              }`}
              placeholder="0.00"
            />
            {errors.requestedRent && (
              <p className="text-red-500 text-sm mt-1">{errors.requestedRent}</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end space-x-4">
        {onBack && (
          <button
            onClick={onBack}
            className="px-4 py-2 text-white bg-gray-600 rounded-md hover:bg-gray-700"
          >
            Back
          </button>
        )}
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Next
        </button>
      </div>
    </div>
  );
} 
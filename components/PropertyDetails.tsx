'use client';

import React from 'react';

interface PropertyData {
  address?: string;
  beds?: string;
  fullBaths?: string;
  halfBaths?: string;
  sqft?: string;
  yearBuilt?: string;
  propertyType?: string;
  quality?: string;
  utilitySchedule?: string;
  requestedRent?: string;
  unit?: string;
  [key: string]: string | undefined;
}

interface PropertyDetailsProps {
  data: PropertyData;
  onUpdate: (data: PropertyData) => void;
  onNext: () => void;
}

export default function PropertyDetails({
  data,
  onUpdate,
  onNext,
}: PropertyDetailsProps) {
  const handleNext = () => {
    const requiredFields = ['address', 'beds', 'fullBaths', 'propertyType', 'utilitySchedule', 'requestedRent'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      alert('Please fill in all required fields marked with *');
      return;
    }
    onNext();
  };

  const qualityOptions = [
    { value: 'unknown', label: 'Unknown', description: 'Property condition has not been assessed' },
    { value: 'excellent', label: 'Excellent', description: 'Like new condition, recent updates, no repairs needed' },
    { value: 'good', label: 'Good', description: 'Well-maintained, minor wear and tear, no major repairs needed' },
    { value: 'fair', label: 'Fair', description: 'Some aging or wear, may need minor repairs' },
    { value: 'poor', label: 'Poor', description: 'Significant wear, needs major repairs or updates' }
  ];

  const formatCurrency = (value: string): string => {
    // Remove all non-numeric characters
    const numericValue = value.replace(/[^0-9]/g, '');
    
    // Convert to cents, then format to dollars and cents
    const dollars = Number(numericValue) / 100;
    return dollars.toFixed(2);
  };

  return (
    <div className="bg-black rounded-lg p-6">
      <h2 className="text-xl font-bold text-white mb-6">Property Details</h2>
      
      <div className="space-y-6">
        {/* Address and Unit Row */}
        <div className="grid grid-cols-[2fr,1fr] gap-4">
          <div>
            <label className="block text-white mb-2">
              Address<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter property address"
              className="w-full h-10 bg-gray-800/50 text-white rounded-md p-2 border border-gray-700"
              value={data.address || ''}
              onChange={(e) => onUpdate({ ...data, address: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-white mb-2">
              Unit or Apt #
            </label>
            <input
              type="text"
              placeholder="Unit number"
              className="w-full h-10 bg-gray-800/50 text-white rounded-md p-2 border border-gray-700"
              value={data.unit || ''}
              onChange={(e) => onUpdate({ ...data, unit: e.target.value })}
            />
          </div>
        </div>

        {/* Beds, Baths, Sqft, Year Row */}
        <div className="grid grid-cols-5 gap-4">
          {['beds', 'fullBaths', 'halfBaths', 'sqft', 'yearBuilt'].map((field) => (
            <div key={field}>
              <label className="block text-white mb-2">
                {field === 'beds' ? 'Beds' :
                 field === 'fullBaths' ? 'Full Baths' :
                 field === 'halfBaths' ? 'Half Baths' :
                 field === 'sqft' ? 'Sqft' : 'Year Built'}
                {(field === 'beds' || field === 'fullBaths') && <span className="text-red-500">*</span>}
              </label>
              <input
                type={field === 'yearBuilt' ? 'text' : 'number'}
                min="0"
                placeholder={field === 'yearBuilt' ? 'YYYY' : ''}
                className="w-full h-10 bg-gray-800/50 text-white rounded-md p-2 border border-gray-700"
                value={data[field] || ''}
                onChange={(e) => {
                  let value = e.target.value;
                  if (field === 'sqft') {
                    value = Math.max(0, Number(value)).toString();
                  }
                  onUpdate({ ...data, [field]: value });
                }}
                required={field === 'beds' || field === 'fullBaths'}
              />
            </div>
          ))}
        </div>

        {/* Property Type, Quality, Utility Row */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-white mb-2">
              Property Type<span className="text-red-500">*</span>
            </label>
            <select
              className="w-full h-10 bg-gray-800/50 text-white rounded-md p-2 border border-gray-700"
              value={data.propertyType || ''}
              onChange={(e) => onUpdate({ ...data, propertyType: e.target.value })}
              required
            >
              <option value="">Select type</option>
              <option value="house">House</option>
              <option value="apartment">Apartment</option>
              <option value="condo">Condo</option>
              <option value="townhouse">Townhouse</option>
              <option value="studio">Studio</option>
              <option value="sro">SRO</option>
            </select>
          </div>
          <div>
            <label className="block text-white mb-2">
              Quality/Condition
            </label>
            <select
              className="w-full h-10 bg-gray-800/50 text-white rounded-md p-2 border border-gray-700"
              value={data.quality || 'unknown'}
              onChange={(e) => onUpdate({ ...data, quality: e.target.value })}
            >
              {qualityOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {data.quality && (
              <p className="text-gray-400 mt-1 text-sm italic">
                {qualityOptions.find(opt => opt.value === data.quality)?.description}
              </p>
            )}
          </div>
          <div>
            <label className="block text-white mb-2">
              Utility schedule<span className="text-red-500">*</span>
            </label>
            <select
              className="w-full h-10 bg-gray-800/50 text-white rounded-md p-2 border border-gray-700"
              value={data.utilitySchedule || ''}
              onChange={(e) => onUpdate({ ...data, utilitySchedule: e.target.value })}
              required
            >
              <option value="">Select utilities</option>
              <option value="all">All utilities paid</option>
              <option value="some">Some utilities paid</option>
              <option value="none">No utilities paid</option>
            </select>
          </div>
        </div>

        {/* Requested Rent */}
        <div className="max-w-xs">
          <label className="block text-white mb-2">
            Requested Rent<span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-gray-400">$</span>
            <input
              type="text"
              className="w-full h-10 bg-gray-800/50 text-white rounded-md p-2 pl-6 border border-gray-700"
              value={`${data.requestedRent || '0.00'}`}
              onChange={(e) => {
                const formattedValue = formatCurrency(e.target.value);
                onUpdate({ ...data, requestedRent: formattedValue });
              }}
              onBlur={(e) => {
                // Ensure proper formatting when field loses focus
                const formattedValue = formatCurrency(e.target.value);
                onUpdate({ ...data, requestedRent: formattedValue });
              }}
              required
            />
          </div>
        </div>

        {/* Next Button */}
        <div className="flex justify-end">
          <button
            onClick={handleNext}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
} 
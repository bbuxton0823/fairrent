'use client';

import { useState } from 'react';

interface AmenityData {
  [key: string]: boolean;
}

interface UtilityData {
  airConditioning?: string;
  heatingFuel?: string;
  cookingFuel?: string;
  hotWater?: string;
  water?: string;
  sewer?: string;
  airConditioningPaidBy?: 'owner' | 'tenant';
  heatingFuelPaidBy?: 'owner' | 'tenant';
  cookingFuelPaidBy?: 'owner' | 'tenant';
  hotWaterPaidBy?: 'owner' | 'tenant';
  waterPaidBy?: 'owner' | 'tenant';
  sewerPaidBy?: 'owner' | 'tenant';
  parking?: string;
  amenities?: AmenityData;
  [key: string]: unknown | string | AmenityData;
}

interface AmenitiesProps {
  data: UtilityData;
  onUpdate: (data: UtilityData) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export default function Amenities({
  data,
  onUpdate,
  onNext,
  onPrevious,
}: AmenitiesProps) {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    let isValid = true;
    
    // Validate all utilities
    utilities.forEach((utility) => {
      // Check utility type selection
      if (!data[utility.id] || data[utility.id] === '') {
        newErrors[utility.id] = `Please select ${utility.label} type`;
        isValid = false;
      }
      
      // Check payment responsibility selection
      if (!data[`${utility.id}PaidBy`]) {
        newErrors[`${utility.id}PaidBy`] = `Please select who pays for ${utility.label}`;
        isValid = false;
      }
    });

    setErrors(newErrors);
    
    if (!isValid) {
      // Find first error and scroll to it
      const firstErrorId = Object.keys(newErrors)[0];
      const element = document.getElementById(firstErrorId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return false;
    }

    return true;
  };

  const handleNext = () => {
    // Validate all required fields before proceeding
    if (validateForm()) {
      // Double check that all utilities are properly selected
      const allUtilitiesComplete = utilities.every(utility => 
        data[utility.id] && 
        data[utility.id] !== '' && 
        data[`${utility.id}PaidBy`] &&
        (data[`${utility.id}PaidBy`] === 'owner' || data[`${utility.id}PaidBy`] === 'tenant')
      );

      if (!allUtilitiesComplete) {
        setErrors(prev => ({
          ...prev,
          general: 'Please complete all utility selections before proceeding'
        }));
        return;
      }

      onNext();
    }
  };

  const handleUtilityChange = (utilityId: string, field: 'type' | 'paidBy', value: string) => {
    const newData = { ...data };
    if (field === 'type') {
      newData[utilityId] = value;
    } else {
      newData[`${utilityId}PaidBy`] = value;
    }
    onUpdate(newData);
    
    // Clear errors for the changed field
    if (errors[utilityId] || errors[`${utilityId}PaidBy`]) {
      const newErrors = { ...errors };
      delete newErrors[utilityId];
      delete newErrors[`${utilityId}PaidBy`];
      setErrors(newErrors);
    }
  };

  const amenities = [
    { id: 'ceilingFan', label: 'Ceiling Fan' },
    { id: 'washerDryer', label: 'Washer/Dryer' },
    { id: 'washerDryerHookup', label: 'Washer/Dryer (hook-up only)' },
    { id: 'dishwasher', label: 'Dishwasher' },
    { id: 'garbageDisposal', label: 'Garbage Disposal' },
    { id: 'garage', label: 'Garage' },
    { id: 'pool', label: 'Pool' },
    { id: 'gym', label: 'Gym' },
    { id: 'furnished', label: 'Furnished' },
    { id: 'balcony', label: 'Balcony' },
    { id: 'storage', label: 'Storage' },
    { id: 'landscape', label: 'Landscape' },
    { id: 'highSpeedInternet', label: 'High-Speed Internet' },
    { id: 'pestControl', label: 'Pest Control' },
    { id: 'gatedCommunity', label: 'Gated Community' },
  ];

  const utilities = [
    { 
      id: 'airConditioning',
      label: 'Air Conditioning',
      options: ['None', 'Window/Wall', 'Central', 'Split System', 'Other']
    },
    { 
      id: 'heatingFuel',
      label: 'Heating Fuel',
      options: ['Electric', 'Gas', 'Oil', 'Propane', 'Heat Pump', 'Other']
    },
    { 
      id: 'cookingFuel',
      label: 'Cooking Fuel',
      options: ['Electric', 'Gas', 'Propane', 'Other']
    },
    { 
      id: 'hotWater',
      label: 'Hot Water',
      options: ['Electric', 'Gas', 'Solar', 'Other']
    },
    { 
      id: 'water',
      label: 'Water',
      options: ['Public', 'Well']
    },
    { 
      id: 'sewer',
      label: 'Sewer',
      options: ['Public', 'Septic']
    },
  ];

  return (
    <div className="bg-black rounded-lg p-6">
      <h2 className="text-xl font-bold text-white mb-6">Property Details</h2>
      
      {/* Amenities Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">Amenities</h3>
        <div className="grid grid-cols-3 gap-4">
          {amenities.map((amenity) => (
            <label key={amenity.id} className="flex items-center space-x-2 text-white">
              <input
                type="checkbox"
                checked={data.amenities?.[amenity.id] || false}
                onChange={(e) => 
                  onUpdate({
                    ...data,
                    amenities: {
                      ...data.amenities,
                      [amenity.id]: e.target.checked
                    }
                  })
                }
                className="form-checkbox h-5 w-5 text-blue-600 bg-gray-700 border-gray-600 rounded"
              />
              <span>{amenity.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Parking */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">Parking</h3>
        <select
          className="w-full bg-gray-800/50 text-white rounded-md p-2 border border-gray-700"
          value={data.parking || ''}
          onChange={(e) => onUpdate({ ...data, parking: e.target.value })}
        >
          <option value="">Select parking type</option>
          <option value="garage">Garage</option>
          <option value="carport">Carport</option>
          <option value="driveway">Driveway</option>
          <option value="street">Street</option>
          <option value="none">None</option>
        </select>
      </div>

      {/* Utilities Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">Utilities</h3>
        {errors.general && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-md">
            <p className="text-red-500 text-sm">{errors.general}</p>
          </div>
        )}
        <div className="grid grid-cols-[1fr,2fr,1fr] gap-4 mb-2">
          <div className="text-white font-semibold">TYPE</div>
          <div></div>
          <div className="text-white font-semibold">PAID BY<span className="text-red-500">*</span></div>
        </div>
        {utilities.map((utility) => (
          <div key={utility.id} className="grid grid-cols-[1fr,2fr,1fr] gap-4 mb-4 items-center">
            <div className="text-white">
              {utility.label}
              <span className="text-red-500">*</span>
            </div>
            <div className="flex flex-col">
              <select
                id={utility.id}
                value={(data[utility.id] as string) || ''}
                onChange={(e) => handleUtilityChange(utility.id, 'type', e.target.value)}
                className={`w-full bg-gray-800/50 text-white rounded-md p-2 border ${
                  errors[utility.id] ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-700'
                }`}
              >
                <option value="">Select type</option>
                {utility.options.map(option => (
                  <option key={option} value={option.toLowerCase()}>{option}</option>
                ))}
              </select>
              {errors[utility.id] && (
                <p className="text-red-500 text-sm mt-1">{errors[utility.id]}</p>
              )}
            </div>
            <div className="flex flex-col">
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={`${utility.id}PaidBy-owner`}
                    name={`${utility.id}PaidBy`}
                    value="owner"
                    checked={data[`${utility.id}PaidBy`] === 'owner'}
                    onChange={(e) => handleUtilityChange(utility.id, 'paidBy', e.target.value)}
                    className={`text-blue-600 ${errors[`${utility.id}PaidBy`] ? 'border-red-500' : ''}`}
                  />
                  <span className="text-white">Owner</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={`${utility.id}PaidBy-tenant`}
                    name={`${utility.id}PaidBy`}
                    value="tenant"
                    checked={data[`${utility.id}PaidBy`] === 'tenant'}
                    onChange={(e) => handleUtilityChange(utility.id, 'paidBy', e.target.value)}
                    className={`text-blue-600 ${errors[`${utility.id}PaidBy`] ? 'border-red-500' : ''}`}
                  />
                  <span className="text-white">Tenant</span>
                </label>
              </div>
              {errors[`${utility.id}PaidBy`] && (
                <p className="text-red-500 text-sm mt-1">{errors[`${utility.id}PaidBy`]}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <button
          onClick={onPrevious}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Next
        </button>
      </div>
    </div>
  );
} 
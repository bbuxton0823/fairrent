'use client'

import React, { useState } from 'react'

const AMENITIES_LIST = [
  'Air Conditioning',
  'Washer/Dryer',
  'Dishwasher',
  'Garage',
  'Pool',
  'Gym',
  'Furnished',
  'Balcony',
  'Storage',
  'Security System',
  'Pet Friendly',
  'High-Speed Internet',
]

const PROPERTY_CONDITIONS = ['Excellent', 'Good', 'Fair', 'Poor']
const PARKING_TYPES = ['Attached Garage', 'Detached Garage', 'Carport', 'Street Parking', 'No Parking']
const UTILITY_TYPES = [
  'Heating Fuel',
  'Cooking Fuel',
  'Hot Water',
  'Electricity',
  'Water',
  'Sewer',
  'Cooling System',
]

interface UtilityInfo {
  type: string;
  responsibility: 'owner' | 'tenant';
}

interface Utilities {
  [key: string]: UtilityInfo;
}

interface AmenitiesData {
  amenities: string[];
  propertyCondition: string;
  parkingType: string;
  utilities: Utilities;
}

interface AmenitiesStepProps {
  onNext: (data: AmenitiesData) => void;
  onPrevious: () => void;
  initialData: Partial<AmenitiesData>;
  stepNumber: number;
  totalSteps: number;
}

export default function AmenitiesStep({ onNext, onPrevious, initialData, stepNumber, totalSteps }: AmenitiesStepProps) {
  const [formData, setFormData] = useState<AmenitiesData>({
    amenities: initialData.amenities || [],
    propertyCondition: initialData.propertyCondition || '',
    parkingType: initialData.parkingType || '',
    utilities: initialData.utilities || {
      'Heating Fuel': { type: '', responsibility: 'owner' },
      'Cooking Fuel': { type: '', responsibility: 'owner' },
      'Hot Water': { type: '', responsibility: 'owner' },
      'Electricity': { type: '', responsibility: 'owner' },
      'Water': { type: '', responsibility: 'owner' },
      'Sewer': { type: '', responsibility: 'owner' },
      'Cooling System': { type: '', responsibility: 'owner' },
    },
  })

  const toggleAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity) 
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }))
  }

  const handleUtilityChange = (utilityName: string, field: 'type' | 'responsibility', value: string) => {
    setFormData(prev => ({
      ...prev,
      utilities: {
        ...prev.utilities,
        [utilityName]: {
          ...prev.utilities[utilityName],
          [field]: value as any, // Cast to any since 'responsibility' is restricted to 'owner' | 'tenant'
        },
      },
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext(formData)
  }

  return (
    <div className="p-6 bg-gray-800 text-white rounded-lg">
      {/* Header */}
      <h2 className="text-2xl font-bold mb-4">Step {stepNumber} of {totalSteps}: Amenities & Utilities</h2>
      <p className="mb-6">
        Select available amenities and provide detailed utility information for the property.
      </p>

      {/* Step Indicators */}
      <div className="flex space-x-2 mb-6">
        <span className="px-3 py-1 bg-gray-600 rounded-full">1</span>
        <span className="px-3 py-1 bg-blue-500 rounded-full">2</span>
        <span className="px-3 py-1 bg-gray-600 rounded-full">3</span>
        <span className="px-3 py-1 bg-gray-600 rounded-full">4</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Amenities Section */}
        <div>
          <h3 className="text-xl font-semibold mb-2">Amenities</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {AMENITIES_LIST.map((amenity) => (
              <label key={amenity} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.amenities.includes(amenity)}
                  onChange={() => toggleAmenity(amenity)}
                  className="form-checkbox h-5 w-5 text-blue-400"
                />
                <span>{amenity}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Property Condition & Parking */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="propertyCondition" className="block text-sm font-medium">
              Property Condition
            </label>
            <select
              id="propertyCondition"
              value={formData.propertyCondition}
              onChange={(e) => setFormData(prev => ({ ...prev, propertyCondition: e.target.value }))}
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md p-2"
            >
              <option value="">Select Condition</option>
              {PROPERTY_CONDITIONS.map((condition) => (
                <option key={condition} value={condition}>
                  {condition}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="parkingType" className="block text-sm font-medium">
              Parking Type
            </label>
            <select
              id="parkingType"
              value={formData.parkingType}
              onChange={(e) => setFormData(prev => ({ ...prev, parkingType: e.target.value }))}
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md p-2"
            >
              <option value="">Select Parking</option>
              {PARKING_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Utilities Section */}
        <div>
          <h3 className="text-xl font-semibold mb-2">Utilities</h3>
          <div className="space-y-4">
            {UTILITY_TYPES.map((utility) => (
              <div key={utility} className="border border-gray-600 p-4 rounded-md">
                <h4 className="font-semibold mb-2">{utility}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor={`${utility}-type`} className="block text-sm font-medium">
                      Type
                    </label>
                    <input
                      type="text"
                      id={`${utility}-type`}
                      value={formData.utilities[utility]?.type || ''}
                      onChange={(e) => handleUtilityChange(utility, 'type', e.target.value)}
                      placeholder={`Enter ${utility} type`}
                      className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Responsibility</label>
                    <div className="flex items-center space-x-4 mt-1">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name={`${utility}-responsibility`}
                          value="owner"
                          checked={formData.utilities[utility]?.responsibility === 'owner'}
                          onChange={(e) => handleUtilityChange(utility, 'responsibility', e.target.value)}
                          className="form-radio text-blue-400"
                        />
                        <span className="ml-1">Owner</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name={`${utility}-responsibility`}
                          value="tenant"
                          checked={formData.utilities[utility]?.responsibility === 'tenant'}
                          onChange={(e) => handleUtilityChange(utility, 'responsibility', e.target.value)}
                          className="form-radio text-blue-400"
                        />
                        <span className="ml-1">Tenant</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={onPrevious}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Previous
          </button>
          <button 
            type="submit" 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  )
} 
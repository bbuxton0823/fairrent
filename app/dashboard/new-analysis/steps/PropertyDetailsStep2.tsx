'use client'

import React, { useState } from 'react'

type UtilityRecord = {
  [key: string]: { type: string; paidBy: string };
};

interface PropertyDetails {
  amenities?: string[];
  propertyCondition?: string;
  utilities?: UtilityRecord;
  parking?: string;
}

interface StepProps {
  formData: Partial<PropertyDetails>;
  updateFormData: (updates: Partial<PropertyDetails>) => void;
  goNext: () => void;
  goPrevious: () => void;
}

const AMENITIES = [
  'Air Conditioning',
  'Garage',
  'Furnished',
  'Security System',
  'Washer/Dryer',
  'Pool',
  'Balcony',
  'Pet Friendly',
  'Dishwasher',
  'Gym',
  'Storage',
  'High-Speed Internet',
]

const PARKING_OPTIONS = ['None', 'Street', 'Garage', 'Carport', 'Assigned Spot']

const UTILITY_FIELDS = [
  { label: 'Heating Fuel', key: 'heatingFuel' },
  { label: 'Cooking Fuel', key: 'cookingFuel' },
  { label: 'Hot Water', key: 'hotWater' },
  { label: 'Water', key: 'water' },
  { label: 'Sewer', key: 'sewer' },
  { label: 'Cooling System', key: 'coolingSystem' },
]

export default function PropertyDetailsStep2({ formData, updateFormData, goNext, goPrevious }: StepProps) {
  // Initialize local state from existing formData
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(formData.amenities || [])
  const [propertyCondition, setPropertyCondition] = useState(formData.propertyCondition || 'Good')
  const [parking, setParking] = useState(formData.parking || '')

  // For each utility field, store { type: string, paidBy: string }
  const [utilities, setUtilities] = useState<UtilityRecord>(() => {
    const initialUtilities = { ...formData.utilities }
    // Ensure all keys exist
    UTILITY_FIELDS.forEach(({ key }) => {
      if (!initialUtilities[key]) {
        initialUtilities[key] = { type: '', paidBy: '' }
      }
    })
    return initialUtilities
  })

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    )
  }

  const handleUtilityTypeChange = (key: string, newType: string) => {
    setUtilities((prev: UtilityRecord) => ({
      ...prev,
      [key]: {
        ...prev[key],
        type: newType
      }
    }))
  }

  const handleUtilityPaidByChange = (key: string, paidBy: string) => {
    setUtilities((prev: UtilityRecord) => ({
      ...prev,
      [key]: {
        ...prev[key],
        paidBy
      }
    }))
  }

  const handleNext = () => {
    updateFormData({
      amenities: selectedAmenities,
      propertyCondition,
      parking,
      utilities,
    })
    goNext()
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Property Details</h2>

      {/* Amenities */}
      <div className="mb-6">
        <label className="font-semibold block mb-2">Amenities</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {AMENITIES.map((amenity) => (
            <label key={amenity} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedAmenities.includes(amenity)}
                onChange={() => toggleAmenity(amenity)}
                className="bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
              />
              <span>{amenity}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Property Condition */}
      <div className="mb-6">
        <label className="block mb-1 font-semibold">Property Condition</label>
        <select
          className="w-full bg-gray-700 text-white rounded p-2 border border-gray-600 focus:border-blue-500 focus:outline-none"
          value={propertyCondition}
          onChange={(e) => setPropertyCondition(e.target.value)}
        >
          <option value="Good">Good</option>
          <option value="Fair">Fair</option>
          <option value="Needs Work">Needs Work</option>
        </select>
        <p className="text-sm text-gray-400 mt-1">
          Well-maintained, minor wear and tear, no major repairs needed
        </p>
      </div>

      {/* Parking */}
      <div className="mb-6">
        <label className="block font-semibold mb-1">Parking</label>
        <select
          className="w-full bg-gray-700 text-white rounded p-2 border border-gray-600 focus:border-blue-500 focus:outline-none"
          value={parking}
          onChange={(e) => setParking(e.target.value)}
        >
          <option value="">Select parking type</option>
          {PARKING_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {/* Utilities */}
      <div>
        <label className="block font-semibold mb-2">Utilities</label>
        <div className="space-y-4">
          {UTILITY_FIELDS.map(({ label, key }) => (
            <div key={key} className="mb-2">
              <p className="font-medium mb-1">{label} *</p>
              <div className="flex flex-col md:flex-row md:items-center gap-2">
                {/* Type */}
                <select
                  className="w-full md:w-1/3 bg-gray-700 text-white rounded p-2 border border-gray-600 focus:border-blue-500 focus:outline-none"
                  value={utilities[key].type}
                  onChange={(e) => handleUtilityTypeChange(key, e.target.value)}
                >
                  <option value="">Select type</option>
                  <option value="None">None</option>
                  <option value="Electric">Electric</option>
                  <option value="Gas">Gas</option>
                  <option value="Public">Public</option>
                </select>
                {/* Paid By */}
                <div className="flex items-center gap-4">
                  <label className="flex items-center space-x-1">
                    <input
                      type="radio"
                      value="Owner"
                      checked={utilities[key].paidBy === 'Owner'}
                      onChange={(e) => handleUtilityPaidByChange(key, e.target.value)}
                      className="bg-gray-700 border-gray-600 focus:ring-blue-500"
                    />
                    <span>Owner</span>
                  </label>
                  <label className="flex items-center space-x-1">
                    <input
                      type="radio"
                      value="Tenant"
                      checked={utilities[key].paidBy === 'Tenant'}
                      onChange={(e) => handleUtilityPaidByChange(key, e.target.value)}
                      className="bg-gray-700 border-gray-600 focus:ring-blue-500"
                    />
                    <span>Tenant</span>
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-between mt-6">
        <button
          onClick={goPrevious}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  )
} 
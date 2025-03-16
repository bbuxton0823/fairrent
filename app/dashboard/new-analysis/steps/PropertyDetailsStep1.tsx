'use client'

import React, { useState } from 'react'

interface PropertyDetails {
  address: string;
  unitNumber?: string;
  beds: string;
  fullBaths: string;
  halfBaths?: string;
  squareFeet?: string;
  yearBuilt?: string;
  propertyType: string;
  quality?: string;
  requestedRent?: string;
  utilitySchedule?: string;
}

interface StepProps {
  formData: Partial<PropertyDetails>;
  updateFormData: (updates: Partial<PropertyDetails>) => void;
  goNext: () => void;
}

export default function PropertyDetailsStep1({ formData, updateFormData, goNext }: StepProps) {
  // Pre-populate local state from formData if it exists
  const [address, setAddress] = useState(formData.address || '')
  const [unitNumber, setUnitNumber] = useState(formData.unitNumber || '')
  const [beds, setBeds] = useState(formData.beds || '')
  const [fullBaths, setFullBaths] = useState(formData.fullBaths || '')
  const [halfBaths, setHalfBaths] = useState(formData.halfBaths || '')
  const [squareFeet, setSquareFeet] = useState(formData.squareFeet || '')
  const [yearBuilt, setYearBuilt] = useState(formData.yearBuilt || '')
  const [propertyType, setPropertyType] = useState(formData.propertyType || '')
  const [quality, setQuality] = useState(formData.quality || 'Unknown')
  const [utilitySchedule, setUtilitySchedule] = useState(formData.utilitySchedule || '')
  const [requestedRent, setRequestedRent] = useState(formData.requestedRent || '')

  const handleNext = () => {
    updateFormData({
      address,
      unitNumber,
      beds,
      fullBaths,
      halfBaths,
      squareFeet,
      yearBuilt,
      propertyType,
      quality,
      utilitySchedule,
      requestedRent,
    })
    goNext()
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Property Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Address */}
        <div>
          <label className="block mb-1 font-semibold">Address*</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full bg-gray-700 text-white rounded p-2 border border-gray-600 focus:border-blue-500 focus:outline-none"
            placeholder="Enter property address"
          />
        </div>

        {/* Unit or Apt # */}
        <div>
          <label className="block mb-1 font-semibold">Unit or Apt #</label>
          <input
            type="text"
            value={unitNumber}
            onChange={(e) => setUnitNumber(e.target.value)}
            className="w-full bg-gray-700 text-white rounded p-2 border border-gray-600 focus:border-blue-500 focus:outline-none"
            placeholder="Unit number"
          />
        </div>

        {/* Beds */}
        <div>
          <label className="block mb-1 font-semibold">Beds*</label>
          <input
            type="number"
            value={beds}
            onChange={(e) => setBeds(e.target.value)}
            className="w-full bg-gray-700 text-white rounded p-2 border border-gray-600 focus:border-blue-500 focus:outline-none"
            placeholder="e.g. 3"
            min="0"
            step="1"
          />
        </div>

        {/* Full Baths */}
        <div>
          <label className="block mb-1 font-semibold">Full Baths*</label>
          <input
            type="number"
            value={fullBaths}
            onChange={(e) => setFullBaths(e.target.value)}
            className="w-full bg-gray-700 text-white rounded p-2 border border-gray-600 focus:border-blue-500 focus:outline-none"
            placeholder="e.g. 2"
            min="0"
            step="1"
          />
        </div>

        {/* Half Baths */}
        <div>
          <label className="block mb-1 font-semibold">Half Baths</label>
          <input
            type="number"
            value={halfBaths}
            onChange={(e) => setHalfBaths(e.target.value)}
            className="w-full bg-gray-700 text-white rounded p-2 border border-gray-600 focus:border-blue-500 focus:outline-none"
            placeholder="e.g. 1"
            min="0"
            step="1"
          />
        </div>

        {/* Sqft */}
        <div>
          <label className="block mb-1 font-semibold">Sqft</label>
          <input
            type="number"
            value={squareFeet}
            onChange={(e) => setSquareFeet(e.target.value)}
            className="w-full bg-gray-700 text-white rounded p-2 border border-gray-600 focus:border-blue-500 focus:outline-none"
            placeholder="e.g. 1200"
            min="0"
          />
        </div>

        {/* Year Built */}
        <div>
          <label className="block mb-1 font-semibold">Year Built</label>
          <input
            type="number"
            value={yearBuilt}
            onChange={(e) => setYearBuilt(e.target.value)}
            className="w-full bg-gray-700 text-white rounded p-2 border border-gray-600 focus:border-blue-500 focus:outline-none"
            placeholder="YYYY"
            min="1800"
            max={new Date().getFullYear()}
          />
        </div>

        {/* Property Type */}
        <div>
          <label className="block mb-1 font-semibold">Property Type*</label>
          <select
            className="w-full bg-gray-700 text-white rounded p-2 border border-gray-600 focus:border-blue-500 focus:outline-none"
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
          >
            <option value="">Select type</option>
            <option value="Single-Family">Single-Family</option>
            <option value="Condo">Condo</option>
            <option value="Townhouse">Townhouse</option>
            <option value="Apartment">Apartment</option>
            <option value="Duplex">Duplex</option>
            <option value="Multi-Unit">Multi-Unit</option>
            <option value="Mobile Home">Mobile Home</option>
          </select>
        </div>

        {/* Quality/Condition */}
        <div>
          <label className="block mb-1 font-semibold">Quality/Condition</label>
          <select
            className="w-full bg-gray-700 text-white rounded p-2 border border-gray-600 focus:border-blue-500 focus:outline-none"
            value={quality}
            onChange={(e) => setQuality(e.target.value)}
          >
            <option value="Unknown">Unknown</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
            <option value="Needs Work">Needs Work</option>
          </select>
        </div>

        {/* Utility Schedule */}
        <div>
          <label className="block mb-1 font-semibold">Utility Schedule*</label>
          <select
            className="w-full bg-gray-700 text-white rounded p-2 border border-gray-600 focus:border-blue-500 focus:outline-none"
            value={utilitySchedule}
            onChange={(e) => setUtilitySchedule(e.target.value)}
          >
            <option value="">Select utilities</option>
            <option value="Separate Meters">Separate Meters</option>
            <option value="Owner Pays All">Owner Pays All</option>
            <option value="Shared Meter">Shared Meter</option>
          </select>
        </div>

        {/* Requested Rent */}
        <div>
          <label className="block mb-1 font-semibold">Requested Rent*</label>
          <div className="relative">
            <span className="absolute left-2 top-2 text-gray-400">$</span>
            <input
              type="number"
              value={requestedRent}
              onChange={(e) => setRequestedRent(e.target.value)}
              className="w-full bg-gray-700 text-white rounded p-2 pl-6 border border-gray-600 focus:border-blue-500 focus:outline-none"
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>
        </div>
      </div>

      {/* Next Button */}
      <div className="mt-6 flex justify-end">
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
'use client'

import React, { useState } from 'react'

interface PropertyData {
  address: string;
  unit: string;
  beds: string;
  fullBaths: string;
  halfBaths: string;
  sqft: string;
  yearBuilt: string;
  propertyType: string;
  quality: string;
  utilitySchedule: string;
  requestedRent: string;
}

interface PropertyInfoStepProps {
  onNext: (data: PropertyData) => void;
  onPrevious: () => void;
  initialData?: Partial<PropertyData>;
}

const PROPERTY_TYPES = [
  'Single-Family',
  'Condo',
  'Townhouse',
  'Multi-Unit',
  'Apartment',
  'Duplex',
  'Mobile Home',
]

const PropertyInfoStep: React.FC<PropertyInfoStepProps> = ({ onNext, onPrevious, initialData = {} }) => {
  const [formData, setFormData] = useState<PropertyData>({
    address: initialData.address || '',
    unit: initialData.unit || '',
    beds: initialData.beds || '',
    fullBaths: initialData.fullBaths || '',
    halfBaths: initialData.halfBaths || '',
    sqft: initialData.sqft || '',
    yearBuilt: initialData.yearBuilt || '',
    propertyType: initialData.propertyType || '',
    quality: initialData.quality || 'Unknown',
    utilitySchedule: initialData.utilitySchedule || '',
    requestedRent: initialData.requestedRent || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(formData);
  };

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4">New Property Analysis</h2>
      <p className="mb-6 text-gray-600">Fill in the property details below to get a comprehensive rental analysis</p>
      {/* Step Indicators */}
      <div className="flex space-x-2 mb-6">
        <span className="px-3 py-1 bg-blue-500 text-white rounded-full">1</span>
        <span className="px-3 py-1 bg-gray-300 text-gray-700 rounded-full">2</span>
        <span className="px-3 py-1 bg-gray-300 text-gray-700 rounded-full">3</span>
        <span className="px-3 py-1 bg-gray-300 text-gray-700 rounded-full">4</span>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address*</label>
            <input
              name="address"
              id="address"
              type="text"
              placeholder="Enter property address"
              value={formData.address}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label htmlFor="unit" className="block text-sm font-medium text-gray-700">Unit or Apt #</label>
            <input
              name="unit"
              id="unit"
              type="text"
              placeholder="Unit number"
              value={formData.unit}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="beds" className="block text-sm font-medium text-gray-700">Beds*</label>
            <input
              name="beds"
              id="beds"
              type="number"
              value={formData.beds}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label htmlFor="fullBaths" className="block text-sm font-medium text-gray-700">Full Baths*</label>
            <input
              name="fullBaths"
              id="fullBaths"
              type="number"
              value={formData.fullBaths}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label htmlFor="halfBaths" className="block text-sm font-medium text-gray-700">Half Baths</label>
            <input
              name="halfBaths"
              id="halfBaths"
              type="number"
              value={formData.halfBaths}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="sqft" className="block text-sm font-medium text-gray-700">Sqft</label>
            <input
              name="sqft"
              id="sqft"
              type="number"
              value={formData.sqft}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label htmlFor="yearBuilt" className="block text-sm font-medium text-gray-700">Year Built</label>
            <input
              name="yearBuilt"
              id="yearBuilt"
              type="number"
              placeholder="YYYY"
              value={formData.yearBuilt}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700">Property Type*</label>
            <select
              name="propertyType"
              id="propertyType"
              value={formData.propertyType}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            >
              <option value="">Select type</option>
              {PROPERTY_TYPES.map((type) => (
                <option key={type} value={type.toLowerCase()}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="quality" className="block text-sm font-medium text-gray-700">Quality/Condition</label>
            <select
              name="quality"
              id="quality"
              value={formData.quality}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            >
              <option value="Unknown">Unknown</option>
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Poor">Poor</option>
            </select>
          </div>
          <div>
            <label htmlFor="utilitySchedule" className="block text-sm font-medium text-gray-700">Utility Schedule*</label>
            <select
              name="utilitySchedule"
              id="utilitySchedule"
              value={formData.utilitySchedule}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            >
              <option value="">Select utilities</option>
              <option value="included">Utilities Included</option>
              <option value="separate">Utilities Not Included</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="requestedRent" className="block text-sm font-medium text-gray-700">Requested Rent*</label>
          <div className="mt-1 flex">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-100 text-gray-500">$
            </span>
            <input
              name="requestedRent"
              id="requestedRent"
              type="number"
              value={formData.requestedRent}
              onChange={handleChange}
              required
              placeholder="0.00"
              step="0.01"
              className="mt-1 block w-full border border-gray-300 rounded-r-md p-2"
            />
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={onPrevious}
            className="px-4 py-2 bg-gray-500 text-white rounded-md"
          >
            Previous
          </button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default PropertyInfoStep; 
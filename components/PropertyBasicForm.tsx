'use client';

import { useState } from 'react';

interface PropertyData {
  address: string;
  unitNumber: string;
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

export default function PropertyBasicForm({ onNext }: { onNext: (data: PropertyData) => void }) {
  const [formData, setFormData] = useState<PropertyData>({
    address: '',
    unitNumber: '',
    beds: '',
    fullBaths: '',
    halfBaths: '',
    sqft: '',
    yearBuilt: '',
    propertyType: '',
    quality: '',
    utilitySchedule: '',
    requestedRent: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(formData);
  };

  return (
    <div className="bg-black rounded-lg p-6 text-white">
      <h2 className="text-2xl font-bold mb-6">Property Details</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Address Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block">
              Address*
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter property address"
                className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white"
                required
              />
            </label>
          </div>
          <div>
            <label className="block">
              Unit or Apt #
              <input
                type="text"
                name="unitNumber"
                value={formData.unitNumber}
                onChange={handleChange}
                placeholder="Unit number"
                className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white"
              />
            </label>
          </div>
        </div>

        {/* Property Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div>
            <label className="block">
              Beds*
              <input
                type="number"
                name="beds"
                value={formData.beds}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white"
                required
              />
            </label>
          </div>
          <div>
            <label className="block">
              Full Baths*
              <input
                type="number"
                name="fullBaths"
                value={formData.fullBaths}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white"
                required
              />
            </label>
          </div>
          <div>
            <label className="block">
              Half Baths
              <input
                type="number"
                name="halfBaths"
                value={formData.halfBaths}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white"
              />
            </label>
          </div>
          <div>
            <label className="block">
              Sqft
              <input
                type="number"
                name="sqft"
                value={formData.sqft}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white"
              />
            </label>
          </div>
          <div>
            <label className="block">
              Year Built
              <input
                type="text"
                name="yearBuilt"
                value={formData.yearBuilt}
                onChange={handleChange}
                placeholder="YYYY"
                className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white"
              />
            </label>
          </div>
        </div>

        {/* Dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block">
              Property Type*
              <select
                name="propertyType"
                value={formData.propertyType}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white"
                required
              >
                <option value="">Select type</option>
                <option value="single-family">Single Family</option>
                <option value="multi-family">Multi Family</option>
                <option value="apartment">Apartment</option>
                <option value="condo">Condo</option>
              </select>
            </label>
          </div>
          <div>
            <label className="block">
              Quality/Condition
              <select
                name="quality"
                value={formData.quality}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white"
              >
                <option value="">Unknown</option>
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
              </select>
            </label>
          </div>
          <div>
            <label className="block">
              Utility Schedule*
              <select
                name="utilitySchedule"
                value={formData.utilitySchedule}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white"
                required
              >
                <option value="">Select utilities</option>
                <option value="all-included">All Included</option>
                <option value="some-included">Some Included</option>
                <option value="none-included">None Included</option>
              </select>
            </label>
          </div>
        </div>

        {/* Requested Rent */}
        <div>
          <label className="block">
            Requested Rent*
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
              <input
                type="number"
                name="requestedRent"
                value={formData.requestedRent}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white pl-8"
                placeholder="0.00"
                required
              />
            </div>
          </label>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
} 
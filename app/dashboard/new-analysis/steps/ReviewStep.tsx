'use client'

import React from 'react'

// Define a type for the comparable property
interface ComparableProperty {
  address: string;
  rent: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
}

interface RentEstimate {
  minRent: number;
  maxRent: number;
  confidence: number;
}

interface Demographics {
  medianIncome: number;
  population: number;
}

interface NeighborhoodData {
  rentEstimate: RentEstimate;
  walkScore: number;
  crimeIndex: number;
  schoolScore: number;
  demographics: Demographics;
  comparableProperties: ComparableProperty[];
}

interface PropertyFormData {
  address: string;
  propertyType: string;
  squareFeet: string;
  bedrooms: string;
  bathrooms: string;
  yearBuilt: string;
  neighborhoodData?: NeighborhoodData;
}

interface ReviewStepProps {
  formData: PropertyFormData;
  updateFormData: (updates: Partial<PropertyFormData>) => void;
  goNext: () => void;
  goPrevious: () => void;
}

export default function ReviewStep({ formData, goPrevious }: ReviewStepProps) {
  const neighborhoodData = formData.neighborhoodData

  if (!neighborhoodData) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Review & Submit</h2>
        <p className="text-red-500">No analysis data available. Please complete previous steps first.</p>
        <div className="mt-6">
          <button onClick={goPrevious} className="bg-gray-600 text-white px-4 py-2 rounded">
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-6">Analysis Results</h2>

      {/* Rent Estimate */}
      <div className="bg-gray-700 rounded-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Estimated Rent Range</h3>
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-xl font-bold">
              {neighborhoodData.rentEstimate.confidence}%
            </div>
            <span className="ml-2 text-sm text-gray-300">Confidence</span>
          </div>
        </div>
        <div className="text-3xl font-bold text-blue-400 mb-2">
          ${neighborhoodData.rentEstimate.minRent.toLocaleString()} - $
          {neighborhoodData.rentEstimate.maxRent.toLocaleString()}
        </div>
        <p className="text-gray-300">Based on market analysis and property features</p>
      </div>

      {/* Property Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Property Details</h3>
          <div className="space-y-2 text-gray-300">
            <p>
              <span className="font-medium">Address:</span> {formData.address}
            </p>
            <p>
              <span className="font-medium">Type:</span> {formData.propertyType}
            </p>
            <p>
              <span className="font-medium">Size:</span> {formData.squareFeet} sq ft
            </p>
            <p>
              <span className="font-medium">Bedrooms:</span> {formData.bedrooms}
            </p>
            <p>
              <span className="font-medium">Bathrooms:</span> {formData.bathrooms}
            </p>
            <p>
              <span className="font-medium">Year Built:</span> {formData.yearBuilt}
            </p>
          </div>
        </div>

        <div className="bg-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Location Analysis</h3>
          <div className="space-y-2 text-gray-300">
            <p>
              <span className="font-medium">Walk Score:</span> {neighborhoodData.walkScore}
            </p>
            <p>
              <span className="font-medium">Crime Index:</span> {neighborhoodData.crimeIndex}
            </p>
            <p>
              <span className="font-medium">School Score:</span> {neighborhoodData.schoolScore}
            </p>
            <p>
              <span className="font-medium">Median Income:</span> $
              {neighborhoodData.demographics.medianIncome.toLocaleString()}
            </p>
            <p>
              <span className="font-medium">Population:</span>{' '}
              {neighborhoodData.demographics.population.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Comparable Properties */}
      <div className="bg-gray-700 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">Comparable Properties</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {neighborhoodData.comparableProperties.map((prop, index) => (
            <div key={index} className="p-4 border border-gray-600 rounded">
              <p className="font-medium">{prop.address}</p>
              <p className="text-blue-400">${prop.rent.toLocaleString()}/month</p>
              <p className="text-gray-300">
                {prop.bedrooms} bed, {prop.bathrooms} bath • {prop.squareFeet} sq ft
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button onClick={goPrevious} className="bg-gray-600 text-white px-4 py-2 rounded">
          Previous
        </button>
        <button
          onClick={() => {
            // TODO: Implement report generation
            console.log('Generating report...')
          }}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Generate Report
        </button>
      </div>
    </div>
  )
} 
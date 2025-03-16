'use client'

import React, { useState } from 'react'

interface LocationData {
  zipCode: string;
  neighborhood: string;
  neighborhoodScore: number | null;
}

interface LocationStepProps {
  onNext: (data: LocationData) => void;
  onPrevious: () => void;
  initialData: LocationData;
  stepNumber: number;
  totalSteps: number;
}

export default function LocationStep({ onNext, onPrevious, initialData, stepNumber, totalSteps }: LocationStepProps) {
  const [formData, setFormData] = useState<LocationData>({
    zipCode: initialData.zipCode || '',
    neighborhood: initialData.neighborhood || '',
    neighborhoodScore: initialData.neighborhoodScore || null,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically fetch neighborhood score based on zip code
    // For now, we'll just pass the data forward
    onNext(formData)
  }

  return (
    <div className="p-6 bg-gray-800 text-white rounded-lg">
      {/* Header */}
      <h2 className="text-2xl font-bold mb-4">Step {stepNumber}: Location & Neighborhood</h2>
      <p className="mb-6">
        Enter the property&apos;s location details to analyze the neighborhood score.
      </p>

      {/* Step Indicators */}
      <div className="flex space-x-2 mb-6">
        {Array.from({ length: totalSteps }, (_, i) => (
          <span
            key={i}
            className={`px-3 py-1 rounded-full ${
              i + 1 === stepNumber ? 'bg-blue-500' : 'bg-gray-600'
            }`}
          >
            {i + 1}
          </span>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Zip Code */}
        <div>
          <label htmlFor="zipCode" className="block text-sm font-medium">
            ZIP Code*
          </label>
          <input
            type="text"
            id="zipCode"
            value={formData.zipCode}
            onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md p-2"
            required
            pattern="[0-9]{5}"
            maxLength={5}
            placeholder="Enter 5-digit ZIP code"
          />
        </div>

        {/* Neighborhood */}
        <div>
          <label htmlFor="neighborhood" className="block text-sm font-medium">
            Neighborhood
          </label>
          <input
            type="text"
            id="neighborhood"
            value={formData.neighborhood}
            onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md p-2"
            placeholder="Enter neighborhood name"
          />
        </div>

        {/* Neighborhood Score (will be calculated) */}
        {formData.neighborhoodScore && (
          <div className="bg-gray-700 p-4 rounded-md">
            <h3 className="text-lg font-semibold mb-2">Neighborhood Score</h3>
            <div className="flex items-center space-x-4">
              <div className="text-3xl font-bold text-blue-400">
                {formData.neighborhoodScore}
              </div>
              <div className="text-sm text-gray-300">
                <p>Based on:</p>
                <ul className="list-disc list-inside">
                  <li>Crime rates</li>
                  <li>School ratings</li>
                  <li>Public transportation</li>
                  <li>Amenities access</li>
                </ul>
              </div>
            </div>
          </div>
        )}

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
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePersistedState } from '../../hooks/usePersistedState'

const PROPERTY_TYPES = [
  'Single-Family',
  'Condo',
  'Townhouse',
  'Multi-Unit',
  'Apartment',
  'Duplex',
  'Mobile Home',
];

const AMENITIES_LIST = [
  'Air Conditioning',
  'Washer/Dryer',
  'Dishwasher',
  'Garage',
  'Pool',
  'Gym',
  'Furnished',
  'Balcony',
  'Pet Friendly',
  'High-Speed Internet',
  'Storage',
  'Security System',
];

// Define types for the analysis response
interface ComparableProperty {
  address: string;
  beds: number;
  baths: number;
  sqft: number;
  rent: number;
  distance: number;
  yearBuilt?: string;
  amenities: string[];
  propertyType: string;
}

interface RentRange {
  low: number;
  median: number;
  high: number;
}

interface RentAnalysis {
  rentRange: RentRange;
  influencingFactors: string[];
  marketComparison: string;
  recommendations: string[];
  comparableProperties: ComparableProperty[];
}

// Define the form data interface
interface PropertyFormData {
  address: string;
  unit: string;
  propertyType: string;
  beds: string;
  fullBaths: string;
  halfBaths: string;
  squareFeet: string;
  yearBuilt: string;
  quality: string;
  requestedRent: string;
  amenities: string[];
  propertyCondition: string;
  parkingType: string;
  utilitySchedule: string;
  utilities: {
    [key: string]: { type: string; responsibility: string };
  };
  zipCode: string;
  neighborhood: string;
  neighborhoodScore: null;
}

export default function RentEstimatePage() {
  const router = useRouter()
  const [formData, setFormData] = usePersistedState<PropertyFormData>('new_analysis_form', {
    // Property Info
    address: '',
    unit: '',
    propertyType: '',
    beds: '',
    fullBaths: '',
    halfBaths: '',
    squareFeet: '',
    yearBuilt: '',
    quality: 'Unknown',
    requestedRent: '',
    
    // Initialize other required fields
    amenities: [],
    propertyCondition: '',
    parkingType: '',
    utilitySchedule: '',
    utilities: {
      'Heating Fuel': { type: '', responsibility: 'owner' },
      'Cooking Fuel': { type: '', responsibility: 'owner' },
      'Hot Water': { type: '', responsibility: 'owner' },
      'Electricity': { type: '', responsibility: 'owner' },
      'Water': { type: '', responsibility: 'owner' },
      'Sewer': { type: '', responsibility: 'owner' },
      'Cooling System': { type: '', responsibility: 'owner' },
    },
    
    // Location fields
    zipCode: '',
    neighborhood: '',
    neighborhoodScore: null,
  })
  
  const [analysis, setAnalysis] = useState<RentAnalysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => {
      const currentAmenities = [...prev.amenities]
      if (currentAmenities.includes(amenity)) {
        return {
          ...prev,
          amenities: currentAmenities.filter(a => a !== amenity)
        }
      } else {
        return {
          ...prev,
          amenities: [...currentAmenities, amenity]
        }
      }
    })
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/rent-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          propertyType: formData.propertyType,
          beds: formData.beds,
          baths: formData.fullBaths,
          squareFeet: formData.squareFeet,
          yearBuilt: formData.yearBuilt,
          address: formData.address,
          amenities: formData.amenities,
          zipCode: formData.zipCode,
          unit: formData.unit,
          quality: formData.quality,
          requestedRent: formData.requestedRent,
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to analyze property')
      }
      
      const data = await response.json()
      setAnalysis(data)
      
      // Scroll to results
      const resultsElement = document.getElementById('results')
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: 'smooth' })
      }
    } catch (err) {
      console.error('Error analyzing property:', err)
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Rental Property Analysis</h1>
          
          <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6">Property Details</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Address Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Property Address*
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                      placeholder="Enter property address"
                    />
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Unit/Apt #
                    <input
                      type="text"
                      name="unit"
                      value={formData.unit}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                      placeholder="Unit number (if applicable)"
                    />
                  </label>
                </div>
              </div>
              
              {/* ZIP Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  ZIP Code*
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    required
                    pattern="[0-9]{5}"
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    placeholder="5-digit ZIP code"
                  />
                </label>
              </div>
              
              {/* Property Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Bedrooms*
                    <input
                      type="number"
                      name="beds"
                      value={formData.beds}
                      onChange={handleChange}
                      required
                      min="0"
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Bathrooms*
                    <input
                      type="number"
                      name="fullBaths"
                      value={formData.fullBaths}
                      onChange={handleChange}
                      required
                      min="0"
                      step="0.5"
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Square Feet*
                    <input
                      type="number"
                      name="squareFeet"
                      value={formData.squareFeet}
                      onChange={handleChange}
                      required
                      min="0"
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Year Built
                    <input
                      type="text"
                      name="yearBuilt"
                      value={formData.yearBuilt}
                      onChange={handleChange}
                      placeholder="YYYY"
                      pattern="[0-9]{4}"
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                  </label>
                </div>
              </div>
              
              {/* Property Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Property Type*
                  <select
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  >
                    <option value="">Select Property Type</option>
                    {PROPERTY_TYPES.map(type => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              
              {/* Amenities */}
              <div>
                <p className="block text-sm font-medium text-gray-700 mb-2">Amenities</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {AMENITIES_LIST.map(amenity => (
                    <label key={amenity} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.amenities.includes(amenity)}
                        onChange={() => handleAmenityToggle(amenity)}
                        className="mr-2"
                      />
                      <span className="text-sm">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
              >
                {loading ? 'Analyzing...' : 'Get Rent Analysis'}
              </button>
              
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
                  {error}
                </div>
              )}
            </form>
          </div>
          
          {/* Results Section */}
          {analysis && (
            <div id="results" className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Rent Analysis Results</h2>
              
              {/* Rent Range */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Estimated Rent</h3>
                <div className="flex flex-col md:flex-row justify-between items-center bg-blue-50 p-4 rounded-lg">
                  <div className="text-center mb-4 md:mb-0">
                    <p className="text-sm text-gray-500">Low</p>
                    <p className="text-xl font-bold">${analysis.rentRange.low}</p>
                  </div>
                  <div className="text-center mb-4 md:mb-0 md:border-l md:border-r md:border-gray-300 md:px-8">
                    <p className="text-sm text-gray-500">Recommended</p>
                    <p className="text-3xl font-bold text-blue-600">${analysis.rentRange.median}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">High</p>
                    <p className="text-xl font-bold">${analysis.rentRange.high}</p>
                  </div>
                </div>
              </div>
              
              {/* Comparable Properties */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Comparable Properties</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {analysis.comparableProperties.map((property, index) => (
                    <div key={index} className="border border-gray-200 rounded-md p-4 hover:shadow-md transition-shadow">
                      <p className="font-medium text-blue-600">{property.address}</p>
                      <p className="text-lg font-bold">${property.rent}/month</p>
                      <div className="mt-2">
                        <p>{property.beds} bed • {property.baths} bath • {property.sqft} sqft</p>
                        <p className="text-sm text-gray-600">{property.distance} miles away</p>
                        {property.yearBuilt && property.yearBuilt !== 'Unknown' && (
                          <p className="text-sm text-gray-600">Built in {property.yearBuilt}</p>
                        )}
                      </div>
                      {property.amenities && property.amenities.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-500">Amenities:</p>
                          <p className="text-sm">{property.amenities.join(', ')}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Influencing Factors */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Factors Influencing Rent</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {analysis.influencingFactors.map((factor, index) => (
                    <li key={index} className="text-gray-700">{factor}</li>
                  ))}
                </ul>
              </div>
              
              {/* Market Comparison */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Market Comparison</h3>
                <p className="text-gray-700">{analysis.marketComparison}</p>
              </div>
              
              {/* Recommendations */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Recommendations</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {analysis.recommendations.map((recommendation, index) => (
                    <li key={index} className="text-gray-700">{recommendation}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 
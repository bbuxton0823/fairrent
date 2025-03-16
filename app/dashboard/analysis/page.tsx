'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@auth0/nextjs-auth0/client'
import PropertySummaryHeader from '../../../components/PropertySummaryHeader'

interface AnalysisData {
  address: string
  unit: string
  propertyType: string
  beds: string
  fullBaths: string
  halfBaths: string
  squareFeet: string
  yearBuilt: string
  quality: string
  requestedRent: string
  amenities: string[]
  propertyCondition: string
  parkingType: string
  utilities: {
    [key: string]: { type: string; responsibility: string }
  }
  zipCode: string
  neighborhood: string
  neighborhoodScore: number | null
}

export default function AnalysisPage() {
  const router = useRouter()
  const { user, isLoading } = useUser()
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null)
  const [rentRange, setRentRange] = useState({ min: 0, max: 0 })
  const [confidence, setConfidence] = useState(0)

  useEffect(() => {
    // Get the saved form data
    const savedData = localStorage.getItem('new_analysis_form')
    if (savedData) {
      const parsedData = JSON.parse(savedData)
      setAnalysisData(parsedData)
      
      // Calculate rent range based on requested rent (this would normally come from an API)
      const requestedRent = Number(parsedData.requestedRent) || 2000
      setRentRange({
        min: Math.floor(requestedRent * 0.9),
        max: Math.ceil(requestedRent * 1.1)
      })
      setConfidence(85) // This would normally be calculated based on data quality
    }
  }, [])

  // Check authentication
  if (isLoading) return <div>Loading...</div>
  if (!user) {
    router.push('/api/auth/login')
    return null
  }

  if (!analysisData) {
    return (
      <main className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">No Property Data Found</h1>
            <p className="mb-4">Please submit a property for analysis first.</p>
            <button
              onClick={() => router.push('/rent-estimate')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md"
            >
              Start New Analysis
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-900 text-white">
      <PropertySummaryHeader />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold mb-6">Rent Analysis Results</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Property Details */}
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Property Details</h3>
              <p className="text-gray-300">{analysisData.address}</p>
              {analysisData.unit && <p className="text-gray-300">Unit: {analysisData.unit}</p>}
              <p className="text-gray-300">{analysisData.propertyType}</p>
              <p className="text-gray-300">Built: {analysisData.yearBuilt}</p>
            </div>
            
            {/* Size & Configuration */}
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Size & Configuration</h3>
              <p className="text-gray-300">{analysisData.beds} Bedrooms</p>
              <p className="text-gray-300">
                {analysisData.fullBaths} Full Baths
                {analysisData.halfBaths && `, ${analysisData.halfBaths} Half Baths`}
              </p>
              <p className="text-gray-300">{analysisData.squareFeet} sq ft</p>
            </div>
            
            {/* Rent Range */}
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Estimated Rent Range</h3>
              <p className="text-2xl font-bold text-blue-400">
                ${rentRange.min.toLocaleString()} - ${rentRange.max.toLocaleString()}
              </p>
              <p className="text-gray-300">Your request: ${Number(analysisData.requestedRent).toLocaleString()}</p>
            </div>
            
            {/* Confidence Score */}
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Analysis Confidence</h3>
              <p className="text-2xl font-bold text-green-400">{confidence}%</p>
              <p className="text-gray-300">Based on available data</p>
            </div>
          </div>
          
          {/* Amenities & Utilities */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-gray-700 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Amenities & Condition</h3>
              <div className="space-y-4">
                <div>
                  <p className="font-medium mb-2">Property Condition: {analysisData.propertyCondition}</p>
                  <p className="font-medium mb-2">Parking: {analysisData.parkingType}</p>
                </div>
                <div>
                  <p className="font-medium mb-2">Amenities:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {analysisData.amenities.map((amenity) => (
                      <p key={amenity} className="text-gray-300">• {amenity}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-700 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Utilities</h3>
              <div className="space-y-3">
                {Object.entries(analysisData.utilities).map(([utility, details]) => (
                  <div key={utility} className="flex justify-between border-b border-gray-600 pb-2">
                    <div>
                      <p className="font-medium">{utility}</p>
                      <p className="text-sm text-gray-300">{details.type || 'Not specified'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-300">Paid by: {details.responsibility}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Location & Market */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-700 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Location Details</h3>
              <div className="space-y-3">
                <p className="text-gray-300">ZIP Code: {analysisData.zipCode}</p>
                <p className="text-gray-300">Neighborhood: {analysisData.neighborhood}</p>
                {analysisData.neighborhoodScore && (
                  <div>
                    <p className="font-medium">Neighborhood Score</p>
                    <p className="text-2xl font-bold text-blue-400">{analysisData.neighborhoodScore}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-gray-700 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Market Analysis</h3>
              <div className="space-y-4">
                <div className="p-4 border border-gray-600 rounded">
                  <p className="font-semibold">Market Trend</p>
                  <p className="text-gray-300">Stable market conditions</p>
                  <p className="text-blue-400">2.5% annual growth</p>
                </div>
                <div className="p-4 border border-gray-600 rounded">
                  <p className="font-semibold">Rental Demand</p>
                  <p className="text-gray-300">High demand in this area</p>
                  <p className="text-blue-400">Average time on market: 14 days</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
} 
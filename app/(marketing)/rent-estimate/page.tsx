'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePersistedState } from '../../hooks/usePersistedState'
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { Separator } from "../../../components/ui/separator";
import { Badge } from "../../../components/ui/badge";
import { Loader2, Printer } from "lucide-react";
import dynamic from 'next/dynamic';
import PrintablePropertyReport from '../../../components/PrintablePropertyReport';

// Dynamically import the map component with no SSR
const PropertyMap = dynamic(() => import('../../../components/PropertyMap'), { 
  ssr: false,
  loading: () => <div className="h-[300px] w-full bg-gray-800 flex items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
    <span className="ml-2 text-gray-400">Loading map...</span>
  </div>
});

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
  source: string;
  url?: string;
}

interface RentRange {
  low: number;
  median: number;
  high: number;
}

interface MapData {
  center: {
    lat: number;
    lng: number;
  };
  comparables: {
    lat: number;
    lng: number;
    address: string;
    rent: number;
    distance: number;
  }[];
}

interface RentAnalysisResult {
  rentRange: {
    low: number;
    median: number;
    high: number;
  };
  influencingFactors: string[];
  marketComparison: string;
  recommendations: string[];
  comparableProperties: ComparableProperty[];
  dataSource: string;
  mapData?: MapData;
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

function ComparablePropertyCard({ property }: { property: ComparableProperty }) {
  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg mb-2">{property.address}</CardTitle>
        <CardDescription className="space-y-2">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="mr-1">{property.beds} bed</Badge>
            <Badge variant="outline" className="mr-1">{property.baths} bath</Badge>
            <Badge variant="outline" className="mr-1">{property.sqft} sqft</Badge>
          </div>
          <div className="flex flex-wrap gap-2 mt-1">
            {property.distance > 0 && (
              <Badge variant="outline">{property.distance} miles away</Badge>
            )}
            <Badge variant="secondary">{property.source}</Badge>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Rent:</span>
            <span className="font-semibold text-lg">${property.rent.toLocaleString()}/mo</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Year Built:</span>
            <span>{property.yearBuilt}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Property Type:</span>
            <span>{property.propertyType}</span>
          </div>
          {property.amenities && property.amenities.length > 0 && (
            <div className="pt-2">
              <span className="text-gray-400 block mb-2">Amenities:</span>
              <div className="flex flex-wrap gap-2">
                {property.amenities.map((amenity, i) => (
                  <Badge key={i} variant="outline" className="text-xs py-1">{amenity}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      {property.url && (
        <CardFooter className="pt-2">
          <a 
            href={property.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 text-sm"
          >
            View listing →
          </a>
        </CardFooter>
      )}
    </Card>
  );
}

function AnalysisResult({ result }: { result: RentAnalysisResult }) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold mb-4">Rent Estimate</h3>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Low</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">${result.rentRange.low.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-gray-800 border-green-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Recommended</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-400">${result.rentRange.median.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">High</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">${result.rentRange.high.toLocaleString()}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Market Analysis</h3>
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="pt-6">
            <p className="mb-4">{result.marketComparison}</p>
            <h4 className="font-semibold mb-2">Key Factors Influencing Rent:</h4>
            <ul className="list-disc pl-5 space-y-1 mb-4">
              {result.influencingFactors.map((factor, i) => (
                <li key={i}>{factor}</li>
              ))}
            </ul>
            <h4 className="font-semibold mb-2">Recommendations:</h4>
            <ul className="list-disc pl-5 space-y-1">
              {result.recommendations.map((rec, i) => (
                <li key={i}>{rec}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {result.mapData && result.mapData.center.lat && result.mapData.center.lng && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Property Map</h3>
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="pt-6">
              <PropertyMap 
                center={result.mapData.center} 
                comparables={result.mapData.comparables} 
              />
            </CardContent>
          </Card>
        </div>
      )}

      <div>
        <h3 className="text-xl font-semibold mb-4">Comparable Properties</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {result.comparableProperties.map((property, i) => (
            <ComparablePropertyCard key={i} property={property} />
          ))}
        </div>
        <p className="text-sm text-gray-400 mt-4">
          Data source: {result.dataSource}
        </p>
      </div>
    </div>
  );
}

export default function RentEstimatePage() {
  const router = useRouter()
  const [formData, setFormData] = usePersistedState<PropertyFormData>('rentEstimateForm', {
    // Property Info
    address: '',
    unit: '',
    propertyType: '',
    beds: '',
    fullBaths: '',
    halfBaths: '',
    squareFeet: '',
    yearBuilt: '',
    quality: 'Average',
    requestedRent: '',
    
    // Initialize other required fields
    amenities: [],
    propertyCondition: 'Average',
    parkingType: 'Street',
    utilitySchedule: 'Tenant Pays All',
    utilities: {
      water: { type: 'Municipal', responsibility: 'Tenant' },
      sewer: { type: 'Municipal', responsibility: 'Tenant' },
      garbage: { type: 'Municipal', responsibility: 'Tenant' },
      electricity: { type: 'Standard', responsibility: 'Tenant' },
      gas: { type: 'Standard', responsibility: 'Tenant' },
      internet: { type: 'Standard', responsibility: 'Tenant' },
    },
    
    // Location fields
    zipCode: '',
    neighborhood: '',
    neighborhoodScore: null,
  })
  
  const [analysis, setAnalysis] = useState<RentAnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPrintableReport, setShowPrintableReport] = useState(false)
  
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
  
  // Toggle printable report view
  const togglePrintableReport = () => {
    setShowPrintableReport(!showPrintableReport);
  };
  
  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {showPrintableReport && analysis ? (
            <>
              <Button 
                onClick={togglePrintableReport} 
                variant="outline" 
                className="mb-6"
              >
                Back to Analysis
              </Button>
              <div className="bg-white rounded-lg">
                <PrintablePropertyReport
                  propertyDetails={{
                    address: formData.address + (formData.unit ? `, ${formData.unit}` : ''),
                    zipCode: formData.zipCode,
                    beds: parseInt(formData.beds) || 0,
                    baths: (parseInt(formData.fullBaths) || 0) + ((parseInt(formData.halfBaths) || 0) * 0.5),
                    squareFeet: parseInt(formData.squareFeet) || 0,
                    propertyType: formData.propertyType,
                    yearBuilt: formData.yearBuilt,
                    amenities: formData.amenities,
                    ownerAskingRent: formData.requestedRent ? parseInt(formData.requestedRent) : undefined
                  }}
                  rentRange={analysis.rentRange}
                  comparableProperties={analysis.comparableProperties}
                  marketInsights={analysis.marketComparison.split('. ').filter(s => s.trim().length > 0)}
                  recommendations={analysis.recommendations}
                />
              </div>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold mb-8 text-center text-white">Rental Property Analysis</h1>
              
              {analysis && (
                <div className="mb-8 flex justify-end">
                  <Button 
                    onClick={togglePrintableReport}
                    className="flex items-center gap-2"
                  >
                    <Printer size={16} />
                    View Printable Report
                  </Button>
                </div>
              )}
              
              <div className="bg-gray-800 shadow-lg rounded-lg p-6 mb-8">
                <h2 className="text-2xl font-bold mb-6 text-white">Property Details</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Address Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300">
                        Property Address*
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          required
                          className="mt-1 block w-full border border-gray-600 rounded-md p-2 bg-gray-700 text-white"
                          placeholder="Enter property address"
                        />
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300">
                        Unit/Apt #
                        <input
                          type="text"
                          name="unit"
                          value={formData.unit}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-600 rounded-md p-2 bg-gray-700 text-white"
                          placeholder="Unit number (if applicable)"
                        />
                      </label>
                    </div>
                  </div>
                  
                  {/* ZIP Code */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300">
                      ZIP Code*
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        required
                        pattern="[0-9]{5}"
                        className="mt-1 block w-full border border-gray-600 rounded-md p-2 bg-gray-700 text-white"
                        placeholder="5-digit ZIP code"
                      />
                    </label>
                  </div>
                  
                  {/* Property Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300">
                        Bedrooms*
                        <input
                          type="number"
                          name="beds"
                          value={formData.beds}
                          onChange={handleChange}
                          required
                          min="0"
                          className="mt-1 block w-full border border-gray-600 rounded-md p-2 bg-gray-700 text-white"
                        />
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300">
                        Bathrooms*
                        <input
                          type="number"
                          name="fullBaths"
                          value={formData.fullBaths}
                          onChange={handleChange}
                          required
                          min="0"
                          step="0.5"
                          className="mt-1 block w-full border border-gray-600 rounded-md p-2 bg-gray-700 text-white"
                        />
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300">
                        Square Feet*
                        <input
                          type="number"
                          name="squareFeet"
                          value={formData.squareFeet}
                          onChange={handleChange}
                          required
                          min="0"
                          className="mt-1 block w-full border border-gray-600 rounded-md p-2 bg-gray-700 text-white"
                        />
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300">
                        Year Built
                        <input
                          type="text"
                          name="yearBuilt"
                          value={formData.yearBuilt}
                          onChange={handleChange}
                          placeholder="YYYY"
                          pattern="[0-9]{4}"
                          className="mt-1 block w-full border border-gray-600 rounded-md p-2 bg-gray-700 text-white"
                        />
                      </label>
                    </div>
                  </div>
                  
                  {/* Property Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300">
                      Property Type*
                      <select
                        name="propertyType"
                        value={formData.propertyType}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border border-gray-600 rounded-md p-2 bg-gray-700 text-white"
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
                    <p className="block text-sm font-medium text-gray-300 mb-2">Amenities</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {AMENITIES_LIST.map(amenity => (
                        <label key={amenity} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.amenities.includes(amenity)}
                            onChange={() => handleAmenityToggle(amenity)}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-300">{amenity}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  {/* Submit Button */}
                  <div className="mt-8">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
                    >
                      {loading ? 'Analyzing...' : 'Get Rent Analysis'}
                    </button>
                  </div>
                  
                  {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4">
                      {error}
                    </div>
                  )}
                </form>
              </div>
              
              {/* Results Section */}
              {analysis && (
                <div id="results" className="bg-gray-800 shadow-lg rounded-lg p-6">
                  <h2 className="text-2xl font-bold mb-6 text-white">Rent Analysis Results</h2>
                  
                  <AnalysisResult result={analysis} />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
} 
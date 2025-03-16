'use client';

import { useState } from 'react';
import { Tab } from '@headlessui/react';
import OpenAIConnectionTest from './components/OpenAIConnectionTest';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function AIDemo() {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // State for property data
  const [propertyData, setPropertyData] = useState({
    address: '',
    propertyType: 'apartment',
    beds: 2,
    baths: 2,
    squareFeet: 1000,
    yearBuilt: 2000,
    amenities: [] as string[],
  });
  
  // State for rent analysis
  const [rentAnalysisResult, setRentAnalysisResult] = useState<any>(null);
  
  // State for rent compliance
  const [complianceData, setComplianceData] = useState({
    state: 'CA',
    city: 'San Francisco',
    currentRent: 2500,
    proposedRent: 2800,
    tenancyStartDate: '2020-01-01',
  });
  const [complianceResult, setComplianceResult] = useState<any>(null);
  
  // State for property description
  const [descriptionData, setDescriptionData] = useState({
    propertyType: 'apartment',
    beds: 2,
    baths: 2,
    squareFeet: 1000,
    location: 'Downtown',
    amenities: ['Hardwood floors', 'Stainless steel appliances', 'In-unit laundry'],
    nearbyAttractions: 'Close to parks, restaurants, and public transportation',
  });
  const [descriptionResult, setDescriptionResult] = useState<any>(null);
  
  // Handle property data change
  const handlePropertyDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      if (checkbox.checked) {
        setPropertyData({
          ...propertyData,
          amenities: [...propertyData.amenities, name],
        });
      } else {
        setPropertyData({
          ...propertyData,
          amenities: propertyData.amenities.filter(item => item !== name),
        });
      }
    } else {
      setPropertyData({
        ...propertyData,
        [name]: value,
      });
    }
  };
  
  // Handle compliance data change
  const handleComplianceDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setComplianceData({
      ...complianceData,
      [name]: value,
    });
  };
  
  // Handle description data change
  const handleDescriptionDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDescriptionData({
      ...descriptionData,
      [name]: value,
    });
  };
  
  // Submit rent analysis
  const submitRentAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/rent-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(propertyData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to analyze rent');
      }
      
      const data = await response.json();
      setRentAnalysisResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  // Submit rent compliance
  const submitRentCompliance = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/rent-compliance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(complianceData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to check compliance');
      }
      
      const data = await response.json();
      setComplianceResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  // Submit property description
  const submitPropertyDescription = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/property-description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(descriptionData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate property description');
      }
      
      const data = await response.json();
      setDescriptionResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">AI Demo</h1>
        <p className="mt-2 text-gray-600">
          Explore the AI capabilities of FairRent. Note: You must have a valid OpenAI API key set in your .env.local file.
        </p>
      </div>
      
      {/* OpenAI Connection Test */}
      <OpenAIConnectionTest />
      
      <Tab.Group selectedIndex={activeTab} onChange={setActiveTab}>
        <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
          <Tab
            className={({ selected }: { selected: boolean }) =>
              classNames(
                'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                selected
                  ? 'bg-white shadow text-blue-700'
                  : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
              )
            }
          >
            Rent Analysis
          </Tab>
          <Tab
            className={({ selected }: { selected: boolean }) =>
              classNames(
                'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                selected
                  ? 'bg-white shadow text-blue-700'
                  : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
              )
            }
          >
            Rent Compliance
          </Tab>
          <Tab
            className={({ selected }: { selected: boolean }) =>
              classNames(
                'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                selected
                  ? 'bg-white shadow text-blue-700'
                  : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
              )
            }
          >
            Property Description
          </Tab>
        </Tab.List>
        <Tab.Panels className="mt-2">
          {/* Rent Analysis Panel */}
          <Tab.Panel className="rounded-xl bg-white p-6 shadow">
            <h2 className="text-xl font-semibold mb-4">Rent Analysis</h2>
            <form onSubmit={submitRentAnalysis} className="space-y-4">
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={propertyData.address}
                  onChange={handlePropertyDataChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="123 Main St, City, State"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700">Property Type</label>
                  <select
                    id="propertyType"
                    name="propertyType"
                    value={propertyData.propertyType}
                    onChange={handlePropertyDataChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="condo">Condo</option>
                    <option value="townhouse">Townhouse</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="beds" className="block text-sm font-medium text-gray-700">Bedrooms</label>
                  <input
                    type="number"
                    id="beds"
                    name="beds"
                    value={propertyData.beds}
                    onChange={handlePropertyDataChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    min="0"
                  />
                </div>
                
                <div>
                  <label htmlFor="baths" className="block text-sm font-medium text-gray-700">Bathrooms</label>
                  <input
                    type="number"
                    id="baths"
                    name="baths"
                    value={propertyData.baths}
                    onChange={handlePropertyDataChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    min="0"
                    step="0.5"
                  />
                </div>
                
                <div>
                  <label htmlFor="squareFeet" className="block text-sm font-medium text-gray-700">Square Feet</label>
                  <input
                    type="number"
                    id="squareFeet"
                    name="squareFeet"
                    value={propertyData.squareFeet}
                    onChange={handlePropertyDataChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    min="0"
                  />
                </div>
                
                <div>
                  <label htmlFor="yearBuilt" className="block text-sm font-medium text-gray-700">Year Built</label>
                  <input
                    type="number"
                    id="yearBuilt"
                    name="yearBuilt"
                    value={propertyData.yearBuilt}
                    onChange={handlePropertyDataChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    min="1800"
                    max={new Date().getFullYear()}
                  />
                </div>
              </div>
              
              <div>
                <span className="block text-sm font-medium text-gray-700 mb-2">Amenities</span>
                <div className="grid grid-cols-2 gap-2">
                  {['In-unit laundry', 'Dishwasher', 'Balcony', 'Parking', 'Pool', 'Gym', 'Pet-friendly', 'Furnished'].map((amenity) => (
                    <div key={amenity} className="flex items-center">
                      <input
                        type="checkbox"
                        id={amenity}
                        name={amenity}
                        checked={propertyData.amenities.includes(amenity)}
                        onChange={handlePropertyDataChange}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor={amenity} className="ml-2 text-sm text-gray-700">{amenity}</label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {loading ? 'Analyzing...' : 'Analyze Rent'}
                </button>
              </div>
            </form>
            
            {error && (
              <div className="mt-4 rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {rentAnalysisResult && (
              <div className="mt-6 rounded-md bg-gray-50 p-4">
                <h3 className="text-lg font-medium text-gray-900">Analysis Results</h3>
                <div className="mt-2 text-sm text-gray-500">
                  <pre className="whitespace-pre-wrap">{JSON.stringify(rentAnalysisResult, null, 2)}</pre>
                </div>
              </div>
            )}
          </Tab.Panel>
          
          {/* Rent Compliance Panel */}
          <Tab.Panel className="rounded-xl bg-white p-6 shadow">
            <h2 className="text-xl font-semibold mb-4">Rent Compliance Check</h2>
            <form onSubmit={submitRentCompliance} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
                  <select
                    id="state"
                    name="state"
                    value={complianceData.state}
                    onChange={handleComplianceDataChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="CA">California</option>
                    <option value="NY">New York</option>
                    <option value="FL">Florida</option>
                    <option value="TX">Texas</option>
                    <option value="IL">Illinois</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={complianceData.city}
                    onChange={handleComplianceDataChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="currentRent" className="block text-sm font-medium text-gray-700">Current Rent ($)</label>
                  <input
                    type="number"
                    id="currentRent"
                    name="currentRent"
                    value={complianceData.currentRent}
                    onChange={handleComplianceDataChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    min="0"
                  />
                </div>
                
                <div>
                  <label htmlFor="proposedRent" className="block text-sm font-medium text-gray-700">Proposed Rent ($)</label>
                  <input
                    type="number"
                    id="proposedRent"
                    name="proposedRent"
                    value={complianceData.proposedRent}
                    onChange={handleComplianceDataChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    min="0"
                  />
                </div>
                
                <div>
                  <label htmlFor="tenancyStartDate" className="block text-sm font-medium text-gray-700">Tenancy Start Date</label>
                  <input
                    type="date"
                    id="tenancyStartDate"
                    name="tenancyStartDate"
                    value={complianceData.tenancyStartDate}
                    onChange={handleComplianceDataChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {loading ? 'Checking...' : 'Check Compliance'}
                </button>
              </div>
            </form>
            
            {error && (
              <div className="mt-4 rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {complianceResult && (
              <div className="mt-6 rounded-md bg-gray-50 p-4">
                <h3 className="text-lg font-medium text-gray-900">Compliance Results</h3>
                <div className="mt-2 text-sm text-gray-500">
                  <pre className="whitespace-pre-wrap">{JSON.stringify(complianceResult, null, 2)}</pre>
                </div>
              </div>
            )}
          </Tab.Panel>
          
          {/* Property Description Panel */}
          <Tab.Panel className="rounded-xl bg-white p-6 shadow">
            <h2 className="text-xl font-semibold mb-4">Property Description Generator</h2>
            <form onSubmit={submitPropertyDescription} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700">Property Type</label>
                  <select
                    id="propertyType"
                    name="propertyType"
                    value={descriptionData.propertyType}
                    onChange={handleDescriptionDataChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="condo">Condo</option>
                    <option value="townhouse">Townhouse</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location/Neighborhood</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={descriptionData.location}
                    onChange={handleDescriptionDataChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Downtown, Uptown, etc."
                  />
                </div>
                
                <div>
                  <label htmlFor="beds" className="block text-sm font-medium text-gray-700">Bedrooms</label>
                  <input
                    type="number"
                    id="beds"
                    name="beds"
                    value={descriptionData.beds}
                    onChange={handleDescriptionDataChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    min="0"
                  />
                </div>
                
                <div>
                  <label htmlFor="baths" className="block text-sm font-medium text-gray-700">Bathrooms</label>
                  <input
                    type="number"
                    id="baths"
                    name="baths"
                    value={descriptionData.baths}
                    onChange={handleDescriptionDataChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    min="0"
                    step="0.5"
                  />
                </div>
                
                <div>
                  <label htmlFor="squareFeet" className="block text-sm font-medium text-gray-700">Square Feet</label>
                  <input
                    type="number"
                    id="squareFeet"
                    name="squareFeet"
                    value={descriptionData.squareFeet}
                    onChange={handleDescriptionDataChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    min="0"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="amenities" className="block text-sm font-medium text-gray-700">Amenities (comma-separated)</label>
                <input
                  type="text"
                  id="amenities"
                  name="amenities"
                  value={descriptionData.amenities.join(', ')}
                  onChange={(e) => setDescriptionData({
                    ...descriptionData,
                    amenities: e.target.value.split(',').map(item => item.trim()).filter(Boolean),
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Hardwood floors, Stainless steel appliances, etc."
                />
              </div>
              
              <div>
                <label htmlFor="nearbyAttractions" className="block text-sm font-medium text-gray-700">Nearby Attractions</label>
                <textarea
                  id="nearbyAttractions"
                  name="nearbyAttractions"
                  value={descriptionData.nearbyAttractions}
                  onChange={handleDescriptionDataChange}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Close to parks, restaurants, public transportation, etc."
                />
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {loading ? 'Generating...' : 'Generate Description'}
                </button>
              </div>
            </form>
            
            {error && (
              <div className="mt-4 rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {descriptionResult && (
              <div className="mt-6 rounded-md bg-gray-50 p-4">
                <h3 className="text-lg font-medium text-gray-900">Generated Description</h3>
                <div className="mt-2 text-sm text-gray-700">
                  {descriptionResult.title && (
                    <h4 className="text-base font-medium mb-2">{descriptionResult.title}</h4>
                  )}
                  <div className="prose prose-sm max-w-none">
                    {descriptionResult.description && (
                      <p>{descriptionResult.description}</p>
                    )}
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={() => {
                        const text = `${descriptionResult.title}\n\n${descriptionResult.description}`;
                        navigator.clipboard.writeText(text);
                      }}
                      className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                      Copy to clipboard
                    </button>
                  </div>
                </div>
              </div>
            )}
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
} 
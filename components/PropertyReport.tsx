import { useState } from 'react';
import ComparableAnalysis from './ComparableAnalysis';
import LocationAnalysis from './LocationAnalysis';
import { ReactNode } from 'react';

interface PropertyReportProps {
  data: {
    propertyDetails: {
      address: string;
      unit: string;
      beds: number;
      fullBaths: number;
      halfBaths: number;
      sqft: number;
      yearBuilt: number;
      propertyType: string;
      quality: string;
      requestedRent: number;
      utilities: {
        heatingFuel: string;
        cookingFuel: string;
        hotWater: string;
        otherElectricity: string;
        coolingSystem: string;
      };
      amenities: string[];
    };
    comparables: Array<{
      address: string;
      rent: number;
      sqft: number;
      yearBuilt: number;
      propertyType: string;
      bedrooms: number;
      fullBaths: number;
      halfBaths: number;
      utilities: {
        heatingFuel: string;
        cookingFuel: string;
        hotWater: string;
        otherElectricity: string;
        coolingSystem: string;
      };
      amenities: string[];
      quality: string;
      distance: number;
    }>;
    neighborhoodAnalysis: {
      score: number;
      categoryBreakdown: {
        crime: { score: number; weightedScore: number; details: any };
        housing: { score: number; weightedScore: number; details: any };
        economicEducation: { score: number; weightedScore: number; details: any };
        services: { score: number; weightedScore: number; details: any };
        demographics: { score: number; weightedScore: number; details: any };
      };
    };
  };
}

export default function PropertyReport({ data }: PropertyReportProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'comparables' | 'neighborhood'>('overview');

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      {/* Report Header */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Property Analysis Report
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Generated on {formatDate(new Date())}
          </p>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <span className="text-gray-500 dark:text-gray-400 text-sm">Address</span>
              <p className="font-medium text-gray-900 dark:text-white">
                {data.propertyDetails.address} {data.propertyDetails.unit}
              </p>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400 text-sm">Property Type</span>
              <p className="font-medium text-gray-900 dark:text-white">
                {data.propertyDetails.propertyType}
              </p>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400 text-sm">Size</span>
              <p className="font-medium text-gray-900 dark:text-white">
                {data.propertyDetails.beds} bed, {data.propertyDetails.fullBaths} bath, {data.propertyDetails.sqft} sqft
              </p>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400 text-sm">Requested Rent</span>
              <p className="font-medium text-gray-900 dark:text-white">
                ${data.propertyDetails.requestedRent.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
          <nav className="-mb-px flex space-x-8">
            {['overview', 'comparables', 'neighborhood'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab
                    ? 'border-blue-500 text-blue-600 dark:text-blue-500'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }
                `}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* Report Content */}
        <div className="space-y-8">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Property Details */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Property Details
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400 text-sm">Year Built</span>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {data.propertyDetails.yearBuilt}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400 text-sm">Condition</span>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {data.propertyDetails.quality}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Utilities
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {Object.entries(data.propertyDetails.utilities).map(([key, value]) => (
                        <div key={key}>
                          <span className="text-gray-500 dark:text-gray-400">
                            {key.replace(/([A-Z])/g, ' $1').trim()}:
                          </span>
                          <span className="ml-1 text-gray-900 dark:text-white">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Amenities
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {data.propertyDetails.amenities.map((amenity) => (
                        <span
                          key={amenity}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Analysis Summary
                </h2>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400 text-sm">Neighborhood Score</span>
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-500">
                      {data.neighborhoodAnalysis.score.toFixed(1)}/10
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400 text-sm">Market Position</span>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                      Competitive
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'comparables' && (
            <ComparableAnalysis
              subjectProperty={{
                address: data.propertyDetails.address,
                rent: data.propertyDetails.requestedRent,
                sqft: data.propertyDetails.sqft,
                yearBuilt: data.propertyDetails.yearBuilt,
                propertyType: data.propertyDetails.propertyType,
                bedrooms: data.propertyDetails.beds,
                fullBaths: data.propertyDetails.fullBaths,
                halfBaths: data.propertyDetails.halfBaths,
                utilities: data.propertyDetails.utilities,
                amenities: data.propertyDetails.amenities,
                quality: data.propertyDetails.quality
              }}
              comparableProperties={data.comparables.map(comp => ({
                ...comp,
                similarity: 0,
                credibility: 0,
                adjustments: [],
                adjustedRent: comp.rent
              }))}
            />
          )}

          {activeTab === 'neighborhood' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Neighborhood Analysis
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Score Breakdown */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Category Scores
                  </h3>
                  <div className="space-y-4">
                    {Object.entries(data.neighborhoodAnalysis.categoryBreakdown).map(([category, categoryData]) => (
                      <div key={category} className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          {category.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <div className="flex items-center">
                          <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mr-2">
                            <div
                              className="h-2 bg-blue-500 rounded-full"
                              style={{ width: `${(categoryData.score / 10) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {categoryData.score.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-6">
                  {Object.entries(data.neighborhoodAnalysis.categoryBreakdown).map(([category, categoryData]) => (
                    <div key={category} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                        {category.replace(/([A-Z])/g, ' $1').trim()} Details
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {Object.entries(categoryData.details).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-gray-500 dark:text-gray-400">
                              {key.replace(/([A-Z])/g, ' $1').trim()}:
                            </span>
                            <span className="text-gray-900 dark:text-white">
                              {typeof value === 'number' ? value.toLocaleString() : String(value)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
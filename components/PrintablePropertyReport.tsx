import React from 'react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { formatCurrency } from '../app/utils/formatters';

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
  latitude?: number;
  longitude?: number;
}

interface RentRange {
  low: number;
  median: number;
  high: number;
}

interface PrintablePropertyReportProps {
  propertyDetails: {
    address: string;
    zipCode: string;
    beds: number;
    baths: number;
    squareFeet: number;
    propertyType: string;
    yearBuilt: string;
    amenities?: string[];
    latitude?: number;
    longitude?: number;
    ownerAskingRent?: number;
  };
  rentRange: RentRange;
  comparableProperties: ComparableProperty[];
  marketInsights: string[];
  recommendations: string[];
}

export default function PrintablePropertyReport({
  propertyDetails,
  rentRange,
  comparableProperties,
  marketInsights,
  recommendations
}: PrintablePropertyReportProps) {
  const handlePrint = () => {
    window.print();
  };

  // Calculate if owner's asking rent is reasonable
  const isAskingRentReasonable = propertyDetails.ownerAskingRent 
    ? propertyDetails.ownerAskingRent <= rentRange.median 
    : null;

  // Format date for the report
  const formattedDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="bg-white p-8 max-w-4xl mx-auto print:p-4 print:max-w-full">
      {/* Print button - hidden when printing */}
      <div className="print:hidden mb-6 flex justify-end">
        <Button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700">
          Print Report
        </Button>
      </div>

      {/* Report Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Rental Property Analysis Report</h1>
        <p className="text-gray-600 mt-2">Generated on {formattedDate}</p>
      </div>

      {/* Subject Property Details */}
      <div className="mb-8 property-details">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Subject Property</h2>
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-xl font-medium text-gray-900 mb-2">{propertyDetails.address}</h3>
          <p className="text-gray-600 mb-4">ZIP Code: {propertyDetails.zipCode}</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <span className="text-gray-500 text-sm">Property Type</span>
              <p className="font-medium text-gray-900">{propertyDetails.propertyType}</p>
            </div>
            <div>
              <span className="text-gray-500 text-sm">Bedrooms</span>
              <p className="font-medium text-gray-900">{propertyDetails.beds}</p>
            </div>
            <div>
              <span className="text-gray-500 text-sm">Bathrooms</span>
              <p className="font-medium text-gray-900">{propertyDetails.baths}</p>
            </div>
            <div>
              <span className="text-gray-500 text-sm">Square Feet</span>
              <p className="font-medium text-gray-900">{propertyDetails.squareFeet}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <span className="text-gray-500 text-sm">Year Built</span>
              <p className="font-medium text-gray-900">{propertyDetails.yearBuilt}</p>
            </div>
            {propertyDetails.ownerAskingRent && (
              <div>
                <span className="text-gray-500 text-sm">Owner's Asking Rent</span>
                <p className="font-medium text-gray-900">{formatCurrency(propertyDetails.ownerAskingRent)}</p>
              </div>
            )}
          </div>
          
          {propertyDetails.amenities && propertyDetails.amenities.length > 0 && (
            <div>
              <span className="text-gray-500 text-sm block mb-2">Amenities</span>
              <div className="flex flex-wrap gap-2">
                {propertyDetails.amenities.map((amenity) => (
                  <span
                    key={amenity}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Rent Estimate */}
      <div className="mb-8 rent-estimate">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Rent Estimate</h2>
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <span className="text-gray-500 text-sm">Low</span>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(rentRange.low)}</p>
            </div>
            <div className="text-center">
              <span className="text-gray-500 text-sm">Recommended</span>
              <p className="text-3xl font-bold text-blue-600">{formatCurrency(rentRange.median)}</p>
            </div>
            <div className="text-center">
              <span className="text-gray-500 text-sm">High</span>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(rentRange.high)}</p>
            </div>
          </div>
          
          {propertyDetails.ownerAskingRent && (
            <div className="mt-4 p-4 rounded-lg border border-gray-200 bg-white">
              <h4 className="font-medium text-gray-900 mb-2">Owner's Asking Rent Analysis</h4>
              {isAskingRentReasonable ? (
                <div className="flex items-center text-green-600">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p>
                    The owner's asking rent of {formatCurrency(propertyDetails.ownerAskingRent)} is reasonable 
                    compared to the recommended rent of {formatCurrency(rentRange.median)}.
                  </p>
                </div>
              ) : (
                <div className="flex items-start text-amber-600">
                  <svg className="w-5 h-5 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p>
                    The owner's asking rent of {formatCurrency(propertyDetails.ownerAskingRent)} is higher than 
                    the recommended rent of {formatCurrency(rentRange.median)}. Consider discussing the 
                    difference of {formatCurrency(propertyDetails.ownerAskingRent - rentRange.median)} with the owner.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Comparable Properties */}
      <div className="mb-8 page-break-before">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Comparable Properties</h2>
        <div className="space-y-6">
          {comparableProperties.map((property, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-lg border border-gray-200 comparable-property">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-medium text-gray-900">{property.address}</h3>
                <p className="text-xl font-bold text-blue-600">{formatCurrency(property.rent)}</p>
              </div>
              
              <p className="text-gray-600 mb-4">
                {property.distance.toFixed(1)} miles away • {property.source}
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <span className="text-gray-500 text-sm">Property Type</span>
                  <p className="font-medium text-gray-900">{property.propertyType}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Bedrooms</span>
                  <p className="font-medium text-gray-900">{property.beds}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Bathrooms</span>
                  <p className="font-medium text-gray-900">{property.baths}</p>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Square Feet</span>
                  <p className="font-medium text-gray-900">{property.sqft}</p>
                </div>
              </div>
              
              {property.yearBuilt && (
                <div className="mb-4">
                  <span className="text-gray-500 text-sm">Year Built</span>
                  <p className="font-medium text-gray-900">{property.yearBuilt}</p>
                </div>
              )}
              
              {property.amenities && property.amenities.length > 0 && (
                <div>
                  <span className="text-gray-500 text-sm block mb-2">Amenities</span>
                  <div className="flex flex-wrap gap-2">
                    {property.amenities.map((amenity) => (
                      <span
                        key={amenity}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Market Insights */}
      <div className="mb-8 market-insights page-break-before">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Market Insights</h2>
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <ul className="space-y-2">
            {marketInsights.map((insight, index) => (
              <li key={index} className="flex items-start">
                <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recommendations */}
      <div className="mb-8 recommendations">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recommendations</h2>
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <ul className="space-y-2">
            {recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>{recommendation}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 pt-6 border-t border-gray-200 text-center text-gray-500 text-sm">
        <p>This report was generated by FairRent. The information provided is based on market data and comparable properties.</p>
        <p className="mt-2">© {new Date().getFullYear()} FairRent. All rights reserved.</p>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            font-size: 12pt;
            color: #000;
            background-color: #fff;
          }
          
          @page {
            margin: 0.5in;
          }
          
          h1 {
            font-size: 18pt;
          }
          
          h2 {
            font-size: 16pt;
          }
          
          .print\\:hidden {
            display: none !important;
          }
          
          .print\\:p-4 {
            padding: 1rem !important;
          }
          
          .print\\:max-w-full {
            max-width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
} 
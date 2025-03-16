'use client';

import { useState } from 'react';
import { PropertyReport } from '../types/report';

interface ReportViewProps {
  report: PropertyReport;
}

export default function ReportView({ report }: ReportViewProps) {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="bg-black rounded-lg p-6">
      {/* Report Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">
          Property Analysis Report
        </h2>
        <p className="text-gray-400">
          {report.propertyDetails.address} {report.propertyDetails.unit}
        </p>
      </div>

      {/* Report Tabs */}
      <div className="border-b border-gray-700 mb-6">
        <nav className="flex space-x-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-4 ${
              activeTab === 'overview'
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-gray-400'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('market')}
            className={`py-2 px-4 ${
              activeTab === 'market'
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-gray-400'
            }`}
          >
            Market Analysis
          </button>
          <button
            onClick={() => setActiveTab('financial')}
            className={`py-2 px-4 ${
              activeTab === 'financial'
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-gray-400'
            }`}
          >
            Financial Analysis
          </button>
        </nav>
      </div>

      {/* Report Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-4">Property Details</h3>
                <div className="space-y-2">
                  <p className="text-gray-400">
                    Beds: {report.propertyDetails.beds}
                  </p>
                  <p className="text-gray-400">
                    Baths: {report.propertyDetails.fullBaths}
                  </p>
                  <p className="text-gray-400">
                    Sqft: {report.propertyDetails.sqft}
                  </p>
                </div>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-4">Neighborhood Score</h3>
                <div className="text-4xl font-bold text-blue-500">
                  {report.location.neighborhoodScore}/10
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'market' && (
          <div className="space-y-6">
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-4">Rental Market Analysis</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-gray-400">Median Rent</p>
                  <p className="text-2xl font-bold text-white">
                    ${report.marketAnalysis.medianRent}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Price per Sqft</p>
                  <p className="text-2xl font-bold text-white">
                    ${report.marketAnalysis.pricePerSqft}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Suggested Rent</p>
                  <p className="text-2xl font-bold text-green-500">
                    ${report.recommendations.suggestedRent}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'financial' && (
          <div className="space-y-6">
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-4">Financial Analysis</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400">Monthly Revenue</p>
                  <p className="text-2xl font-bold text-white">
                    ${report.financialAnalysis.estimatedMonthlyRevenue}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Monthly Expenses</p>
                  <p className="text-2xl font-bold text-white">
                    ${Object.values(report.financialAnalysis.estimatedMonthlyExpenses).reduce((a, b) => a + b, 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
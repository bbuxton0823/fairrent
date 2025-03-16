"use client";

import React from "react";
import type { PropertyFormData } from '../types';

interface RentEstimate {
  minRent: number;
  maxRent: number;
  confidence: number;
}

interface ComparableProperty {
  address: string;
  rent?: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
}

interface AnalysisStepProps {
  formData: PropertyFormData;
  updateFormData: (updates: Partial<PropertyFormData>) => void;
  goNext: () => void;
  goPrevious: () => void;
}

export default function AnalysisStep({
  formData,
  goNext,
  goPrevious,
}: AnalysisStepProps) {
  const neighborhoodData = formData.neighborhoodData;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-6">Property Analysis</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Property Details</h3>
          <div className="space-y-2 text-gray-300">
            <p><span className="font-medium">Address:</span> {formData.address || "N/A"}</p>
            <p><span className="font-medium">Property Type:</span> {formData.propertyType || "N/A"}</p>
            <p><span className="font-medium">Size:</span> {formData.squareFeet || "N/A"} sq ft</p>
            <p><span className="font-medium">Bedrooms:</span> {formData.beds || "N/A"}</p>
            <p><span className="font-medium">Bathrooms:</span> {formData.fullBaths || "N/A"} full, {formData.halfBaths || "0"} half</p>
          </div>
        </div>

        <div className="bg-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Estimated Rent Range</h3>
          {neighborhoodData?.rentEstimate ? (
            <div>
              <p className="text-3xl font-bold text-blue-400 mb-2">
                ${neighborhoodData.rentEstimate.minRent.toLocaleString()} - ${neighborhoodData.rentEstimate.maxRent.toLocaleString()}
              </p>
              <p className="text-gray-300">Confidence: {neighborhoodData.rentEstimate.confidence}%</p>
            </div>
          ) : (
            <p className="text-gray-300">No estimate available</p>
          )}
        </div>
      </div>

      <div className="bg-gray-700 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">Comparable Properties</h3>
        <div className="space-y-4">
          {neighborhoodData?.comparableProperties ? (
            neighborhoodData.comparableProperties.map((comp, index) => (
              <div key={index} className="border border-gray-600 p-4 rounded">
                <p>{comp.address}</p>
                <p className="text-blue-400">${comp.rent.toLocaleString()}/month</p>
                <p className="text-gray-300">
                  {comp.bedrooms} bed, {comp.bathrooms} bath • {comp.squareFeet} sq ft
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-300">No comparable properties found.</p>
          )}
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={goPrevious}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
        >
          Previous
        </button>
        <button
          onClick={goNext}
          disabled={!neighborhoodData?.rentEstimate}
          className={`${
            neighborhoodData?.rentEstimate ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-500 cursor-not-allowed"
          } text-white px-4 py-2 rounded transition-colors`}
        >
          Next
        </button>
      </div>
    </div>
  );
} 
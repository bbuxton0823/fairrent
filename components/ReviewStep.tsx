'use client';

import { useFormContext } from '../contexts/FormContext';

interface ReviewStepProps {
  onPrevious: () => void;
  onSubmit: () => void;
}

export default function ReviewStep({ onPrevious, onSubmit }: ReviewStepProps) {
  const { formData } = useFormContext();

  const formatUtility = (utility: string) => {
    const type = formData[utility];
    const paidBy = formData[`${utility}PaidBy`];
    return `${type} (Paid by ${paidBy})`;
  };

  return (
    <div className="space-y-6 p-6 bg-gray-900 rounded-lg">
      <h2 className="text-xl font-bold text-white">Review Your Analysis</h2>

      {/* Property Details Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Property Details</h3>
        <div className="grid grid-cols-2 gap-4 bg-gray-800 p-4 rounded-lg">
          <div>
            <label className="block text-gray-400 text-sm">Address</label>
            <p className="text-white">{formData.address}</p>
          </div>
          <div>
            <label className="block text-gray-400 text-sm">Unit/Apt #</label>
            <p className="text-white">{formData.unit || 'N/A'}</p>
          </div>
          <div>
            <label className="block text-gray-400 text-sm">Beds</label>
            <p className="text-white">{formData.beds}</p>
          </div>
          <div>
            <label className="block text-gray-400 text-sm">Baths</label>
            <p className="text-white">{formData.fullBaths} full, {formData.halfBaths || 0} half</p>
          </div>
          <div>
            <label className="block text-gray-400 text-sm">Square Footage</label>
            <p className="text-white">{formData.sqft || 'N/A'}</p>
          </div>
          <div>
            <label className="block text-gray-400 text-sm">Year Built</label>
            <p className="text-white">{formData.yearBuilt || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Amenities Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Amenities</h3>
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(formData.amenities || {}).map(([key, value]) => 
              value && (
                <div key={key} className="text-white flex items-center space-x-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Property Condition & Parking */}
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Property Condition</h3>
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-white">{formData.condition}</p>
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Parking</h3>
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-white">{formData.parking || 'None'}</p>
          </div>
        </div>
      </div>

      {/* Utilities Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Utilities</h3>
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="grid grid-cols-1 gap-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 text-sm">Heating Fuel</label>
                <p className="text-white">{formatUtility('heatingFuel')}</p>
              </div>
              <div>
                <label className="block text-gray-400 text-sm">Cooking Fuel</label>
                <p className="text-white">{formatUtility('cookingFuel')}</p>
              </div>
              <div>
                <label className="block text-gray-400 text-sm">Hot Water</label>
                <p className="text-white">{formatUtility('hotWater')}</p>
              </div>
              <div>
                <label className="block text-gray-400 text-sm">Water</label>
                <p className="text-white">{formatUtility('water')}</p>
              </div>
              <div>
                <label className="block text-gray-400 text-sm">Sewer</label>
                <p className="text-white">{formatUtility('sewer')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <button
          onClick={onPrevious}
          className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700"
        >
          Previous
        </button>
        <button
          onClick={onSubmit}
          className="bg-green-600 text-white px-8 py-2 rounded-md hover:bg-green-700"
        >
          Submit Analysis
        </button>
      </div>
    </div>
  );
} 
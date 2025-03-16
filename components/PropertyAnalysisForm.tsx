'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface UtilityDetail {
  type: string;
  paidBy: 'owner' | 'tenant';
}

interface FormData {
  // Basic Property Info
  address: string;
  unitNumber: string;
  propertyType: string;
  bedrooms: string;
  fullBaths: string;
  halfBaths: string;
  squareFootage: string;
  yearBuilt: string;
  condition: string;
  utilitySchedule: string;
  requestedRent: string;
  parking: string;

  // Family Details
  familyName: string;
  voucherBeds: string;

  // Amenities
  amenities: string[];

  // Utilities
  utilities: {
    heatingFuel: UtilityDetail;
    cookingFuel: UtilityDetail;
    hotWater: UtilityDetail;
    otherElectricity: UtilityDetail;
    water: { type: string, paidBy: 'owner' | 'tenant' };
    sewer: { type: string, paidBy: 'owner' | 'tenant' };
    coolingSystem: UtilityDetail;
    [key: string]: UtilityDetail | { type: string, paidBy: 'owner' | 'tenant' };
  };
}

export default function PropertyAnalysisForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    // Basic Info (Step 1)
    address: '',
    unitNumber: '',
    propertyType: '',
    bedrooms: '',
    fullBaths: '',
    halfBaths: '',
    squareFootage: '',
    yearBuilt: '',
    condition: '',
    utilitySchedule: '',
    requestedRent: '',
    parking: '',
    
    // Family Details
    familyName: '',
    voucherBeds: '',
    
    // Property Details (Step 2)
    amenities: [],
    
    // Utilities
    utilities: {
      heatingFuel: { type: '', paidBy: 'owner' },
      cookingFuel: { type: '', paidBy: 'owner' },
      hotWater: { type: '', paidBy: 'owner' },
      otherElectricity: { type: '', paidBy: 'owner' },
      water: { type: '', paidBy: 'owner' },
      sewer: { type: '', paidBy: 'owner' },
      coolingSystem: { type: '', paidBy: 'owner' },
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleUtilityChange = (
    utilityName: string,
    field: 'type' | 'paidBy',
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      utilities: {
        ...prev.utilities,
        [utilityName]: {
          ...prev.utilities[utilityName],
          [field]: value
        }
      }
    }));
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-black p-6 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Property Details
        </h3>
        
        {/* Address and Unit */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="md:col-span-2">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Address<span className="text-red-500">*</span>
            </label>
            <div className="mt-1 flex">
              <input
                type="text"
                name="address"
                id="address"
                value={formData.address}
                onChange={handleInputChange}
                className="flex-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
                placeholder="Enter property address"
                required
              />
              <button
                type="button"
                className="ml-2 px-3 py-2 text-sm text-blue-600 hover:text-blue-500"
                onClick={() => {/* TODO: Implement manual entry */}}
              >
                Enter manually
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="unitNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Unit or Apt #
            </label>
            <input
              type="text"
              name="unitNumber"
              id="unitNumber"
              value={formData.unitNumber || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
              placeholder="Unit number"
            />
          </div>
        </div>

        {/* Beds, Baths, Sqft, Year */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div>
            <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Beds<span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="bedrooms"
              id="bedrooms"
              value={formData.bedrooms}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
              min="0"
              required
            />
          </div>
          <div>
            <label htmlFor="fullBaths" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Full Baths<span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="fullBaths"
              id="fullBaths"
              value={formData.fullBaths || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
              min="0"
              required
            />
          </div>
          <div>
            <label htmlFor="halfBaths" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Half Baths
            </label>
            <input
              type="number"
              name="halfBaths"
              id="halfBaths"
              value={formData.halfBaths || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
              min="0"
            />
          </div>
          <div>
            <label htmlFor="squareFootage" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Sqft
            </label>
            <input
              type="number"
              name="squareFootage"
              id="squareFootage"
              value={formData.squareFootage}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
              min="0"
            />
          </div>
          <div>
            <label htmlFor="yearBuilt" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Year Built
            </label>
            <input
              type="text"
              name="yearBuilt"
              id="yearBuilt"
              value={formData.yearBuilt}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
              placeholder="YYYY"
              maxLength={4}
            />
          </div>
        </div>

        {/* Property Type, Quality, Utilities */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Property Type<span className="text-red-500">*</span>
            </label>
            <select
              name="propertyType"
              id="propertyType"
              value={formData.propertyType}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
              required
            >
              <option value="">Select type</option>
              <option value="singleFamily">Single Family</option>
              <option value="apartment">Apartment</option>
              <option value="condo">Condo</option>
              <option value="townhouse">Townhouse</option>
              <option value="duplex">Duplex</option>
              <option value="mobile">Mobile Home</option>
            </select>
          </div>
          <div>
            <label htmlFor="condition" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Quality/Condition
            </label>
            <select
              name="condition"
              id="condition"
              value={formData.condition}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
            >
              <option value="unknown">Unknown</option>
              <option value="excellent">Excellent</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="poor">Poor</option>
            </select>
          </div>
          <div>
            <label htmlFor="utilitySchedule" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Utility Schedule<span className="text-red-500">*</span>
            </label>
            <select
              name="utilitySchedule"
              id="utilitySchedule"
              value={formData.utilitySchedule || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
              required
            >
              <option value="">Select utilities</option>
              <option value="allUtilities">All Utilities Included</option>
              <option value="someUtilities">Some Utilities Included</option>
              <option value="noUtilities">No Utilities Included</option>
            </select>
          </div>
        </div>

        {/* Requested Rent */}
        <div className="max-w-xs">
          <label htmlFor="requestedRent" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Requested Rent<span className="text-red-500">*</span>
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              name="requestedRent"
              id="requestedRent"
              value={formData.requestedRent || ''}
              onChange={handleInputChange}
              className="block w-full pl-7 pr-12 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
              placeholder="0.00"
              required
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Amenities
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            'Air Conditioning',
            'Washer/Dryer',
            'Dishwasher',
            'Garage',
            'Pool',
            'Gym',
            'Furnished',
            'Balcony',
            'Storage',
            'Security System',
            'Pet Friendly',
            'High-Speed Internet'
          ].map((amenity) => (
            <div key={amenity} className="flex items-center">
              <input
                type="checkbox"
                id={amenity}
                checked={formData.amenities.includes(amenity)}
                onChange={() => handleAmenityToggle(amenity)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor={amenity} className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                {amenity}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="condition" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Property Condition
          </label>
          <select
            name="condition"
            id="condition"
            value={formData.condition}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
          >
            <option value="">Select condition</option>
            <option value="excellent">Excellent</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
            <option value="needsWork">Needs Work</option>
          </select>
        </div>

        <div>
          <label htmlFor="parking" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Parking
          </label>
          <select
            name="parking"
            id="parking"
            value={formData.parking}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
          >
            <option value="">Select parking type</option>
            <option value="garage">Garage</option>
            <option value="driveway">Driveway</option>
            <option value="street">Street</option>
            <option value="none">None</option>
          </select>
        </div>
      </div>

      {/* Utilities Section */}
      <div className="bg-white dark:bg-black p-6 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Utilities
        </h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-12 gap-4 items-center text-sm">
            <div className="col-span-2 font-medium text-gray-700 dark:text-gray-300">
              TYPE
            </div>
            <div className="col-span-5">
            </div>
            <div className="col-span-5 font-medium text-gray-700 dark:text-gray-300">
              PAID BY
            </div>
          </div>

          {[
            { name: 'heatingFuel', label: 'Heating Fuel', required: true },
            { name: 'cookingFuel', label: 'Cooking Fuel', required: true },
            { name: 'hotWater', label: 'Hot Water', required: true },
            { name: 'otherElectricity', label: 'Other Electricity', required: true },
            { name: 'coolingSystem', label: 'Cooling System', required: true },
          ].map((utility) => (
            <div key={utility.name} className="grid grid-cols-12 gap-4 items-center">
              <div className="col-span-2">
                <label htmlFor={utility.name} className="block text-sm text-gray-700 dark:text-gray-300">
                  {utility.label}
                  {utility.required && <span className="text-red-500">*</span>}
                </label>
              </div>
              <div className="col-span-5">
                <select
                  id={utility.name}
                  value={formData.utilities[utility.name].type}
                  onChange={(e) => handleUtilityChange(utility.name, 'type', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
                  required={utility.required}
                >
                  <option value="">Select type</option>
                  <option value="electric">Electric</option>
                  <option value="gas">Gas</option>
                  <option value="oil">Oil</option>
                  <option value="propane">Propane</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="col-span-5">
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name={`${utility.name}-paidBy`}
                      value="owner"
                      checked={formData.utilities[utility.name].paidBy === 'owner'}
                      onChange={(e) => handleUtilityChange(utility.name, 'paidBy', e.target.value)}
                      className="form-radio h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Owner</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name={`${utility.name}-paidBy`}
                      value="tenant"
                      checked={formData.utilities[utility.name].paidBy === 'tenant'}
                      onChange={(e) => handleUtilityChange(utility.name, 'paidBy', e.target.value)}
                      className="form-radio h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Tenant</span>
                  </label>
                </div>
              </div>
            </div>
          ))}

          {/* Water with Public/Well options */}
          <div className="grid grid-cols-12 gap-4 items-center">
            <div className="col-span-2">
              <label htmlFor="water" className="block text-sm text-gray-700 dark:text-gray-300">
                Water<span className="text-red-500">*</span>
              </label>
            </div>
            <div className="col-span-5">
              <select
                id="water"
                value={formData.utilities.water.type}
                onChange={(e) => handleUtilityChange('water', 'type', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
                required
              >
                <option value="">Select type</option>
                <option value="public">Public</option>
                <option value="well">Well</option>
              </select>
            </div>
            <div className="col-span-5">
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="water-paidBy"
                    value="owner"
                    checked={formData.utilities.water.paidBy === 'owner'}
                    onChange={(e) => handleUtilityChange('water', 'paidBy', e.target.value)}
                    className="form-radio h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Owner</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="water-paidBy"
                    value="tenant"
                    checked={formData.utilities.water.paidBy === 'tenant'}
                    onChange={(e) => handleUtilityChange('water', 'paidBy', e.target.value)}
                    className="form-radio h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Tenant</span>
                </label>
              </div>
            </div>
          </div>

          {/* Sewer with Public/Septic options */}
          <div className="grid grid-cols-12 gap-4 items-center">
            <div className="col-span-2">
              <label htmlFor="sewer" className="block text-sm text-gray-700 dark:text-gray-300">
                Sewer<span className="text-red-500">*</span>
              </label>
            </div>
            <div className="col-span-5">
              <select
                id="sewer"
                value={formData.utilities.sewer.type}
                onChange={(e) => handleUtilityChange('sewer', 'type', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
                required
              >
                <option value="">Select type</option>
                <option value="public">Public</option>
                <option value="septic">Septic</option>
              </select>
            </div>
            <div className="col-span-5">
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="sewer-paidBy"
                    value="owner"
                    checked={formData.utilities.sewer.paidBy === 'owner'}
                    onChange={(e) => handleUtilityChange('sewer', 'paidBy', e.target.value)}
                    className="form-radio h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Owner</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="sewer-paidBy"
                    value="tenant"
                    checked={formData.utilities.sewer.paidBy === 'tenant'}
                    onChange={(e) => handleUtilityChange('sewer', 'paidBy', e.target.value)}
                    className="form-radio h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Tenant</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-black p-6 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Family Details
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="familyName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Family Name
            </label>
            <input
              type="text"
              name="familyName"
              id="familyName"
              value={formData.familyName}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
            />
          </div>
          
          <div>
            <label htmlFor="voucherBeds" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Voucher Beds<span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="voucherBeds"
              id="voucherBeds"
              value={formData.voucherBeds}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
              required
            />
          </div>
        </div>
      </div>
    </div>
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement API call to save and analyze property
    console.log('Form submitted:', formData);
    router.push('/dashboard/analysis-result');
  };

  const validateForm = (step: number): boolean => {
    switch (step) {
      case 1:
        return (
          !!formData.address &&
          !!formData.propertyType &&
          !!formData.bedrooms &&
          !!formData.fullBaths
        );
      case 2:
        return Object.entries(formData.utilities).every(
          ([key, value]) => value.type && value.paidBy
        );
      case 3:
        return !!formData.familyName && !!formData.voucherBeds;
      default:
        return true;
    }
  };

  return (
    <div className="bg-white dark:bg-black shadow rounded-lg p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {[1, 2, 3, 4].map((stepNumber) => (
            <div
              key={stepNumber}
              className={`flex items-center ${stepNumber < 4 ? 'flex-1' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 
                  ${step >= stepNumber 
                    ? 'border-blue-600 bg-blue-600 text-white' 
                    : 'border-gray-300 text-gray-500'
                  }`}
              >
                {stepNumber}
              </div>
              {stepNumber < 4 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    step > stepNumber ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="text-center text-sm font-medium text-gray-500">
          {step === 1 && 'Basic Information'}
          {step === 2 && 'Property Details'}
          {step === 3 && 'Financial Information'}
          {step === 4 && 'Market Information'}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}

        <div className="flex justify-between pt-4">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              Previous
            </button>
          )}
          {step < 4 ? (
            <button
              type="button"
              onClick={() => {
                if (validateForm(step)) {
                  setStep(step + 1);
                } else {
                  alert('Please fill in all required fields before proceeding.');
                }
              }}
              className="ml-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="ml-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Analyze Property
            </button>
          )}
        </div>
      </form>
    </div>
  );
} 
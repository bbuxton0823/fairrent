'use client';

import { useState } from 'react';

// Define condition descriptions
const conditionDescriptions = {
  Good: "Well-maintained, minor wear and tear, no major repairs needed",
  Excellent: "Like new, recently renovated or built, modern fixtures, no repairs needed",
  Fair: "Some aging, may need minor repairs, functional but dated",
  Poor: "Significant repairs needed, outdated features, potential structural issues"
};

interface AmenitiesFormData {
  amenities: {
    airConditioning: boolean;
    washerDryer: boolean;
    washerDryerHookups: boolean;
    dishwasher: boolean;
    garage: boolean;
    pool: boolean;
    gym: boolean;
    furnished: boolean;
    balcony: boolean;
    storage: boolean;
    securitySystem: boolean;
    gatedCommunity: boolean;
    petFriendly: boolean;
    highSpeedInternet: boolean;
    pestControl: boolean;
    onSiteMaintenance: boolean;
  };
  propertyCondition: string;
  propertyConditionDescription: string;
  parking: string;
  utilities: {
    heatingFuel: {
      type: string;
      paidBy: 'Owner' | 'Tenant';
    };
    cookingFuel: {
      type: string;
      paidBy: 'Owner' | 'Tenant';
    };
    hotWater: {
      type: string;
      paidBy: 'Owner' | 'Tenant';
    };
    water: {
      type: string;
      paidBy: 'Owner' | 'Tenant';
    };
    sewer: {
      type: string;
      paidBy: 'Owner' | 'Tenant';
    };
    coolingSystem: {
      type: string;
      paidBy: 'Owner' | 'Tenant';
    };
    electricity: {
      type: string;
      paidBy: 'Owner' | 'Tenant';
    };
  };
}

interface ValidationErrors {
  propertyCondition?: string;
  parking?: string;
  utilities?: {
    [key: string]: string | undefined;
    heatingFuel?: string;
    cookingFuel?: string;
    hotWater?: string;
    water?: string;
    sewer?: string;
    coolingSystem?: string;
    electricity?: string;
  };
}

export default function AmenitiesForm({
  onNext,
  onBack,
  initialData
}: {
  onNext: (data: AmenitiesFormData) => void;
  onBack: () => void;
  initialData?: AmenitiesFormData;
}) {
  const [formData, setFormData] = useState<AmenitiesFormData>(() => {
    // Use initialData if provided, otherwise use default values
    return initialData || {
      amenities: {
        airConditioning: false,
        washerDryer: false,
        washerDryerHookups: false,
        dishwasher: false,
        garage: false,
        pool: false,
        gym: false,
        furnished: false,
        balcony: false,
        storage: false,
        securitySystem: false,
        gatedCommunity: false,
        petFriendly: false,
        highSpeedInternet: false,
        pestControl: false,
        onSiteMaintenance: false,
      },
      propertyCondition: 'Good',
      propertyConditionDescription: '',
      parking: '',
      utilities: {
        heatingFuel: { type: '', paidBy: 'Owner' },
        cookingFuel: { type: '', paidBy: 'Owner' },
        hotWater: { type: '', paidBy: 'Owner' },
        water: { type: '', paidBy: 'Owner' },
        sewer: { type: '', paidBy: 'Owner' },
        coolingSystem: { type: '', paidBy: 'Owner' },
        electricity: { type: '', paidBy: 'Owner' },
      }
    };
  });

  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Required fields validation
    if (!formData.propertyCondition) {
      newErrors.propertyCondition = 'Property condition is required';
    }

    if (!formData.parking) {
      newErrors.parking = 'Parking information is required';
    }

    // Utilities validation
    const utilityErrors: { [key: string]: string } = {};
    Object.entries(formData.utilities).forEach(([key, value]) => {
      if (key !== 'electricity') {
        if (!value.type) {
          utilityErrors[key] = `${key.replace(/([A-Z])/g, ' $1').trim()} type is required`;
        }
      }
      if (!value.paidBy) {
        utilityErrors[key] = `Must specify who pays for ${key.replace(/([A-Z])/g, ' $1').trim()}`;
      }
    });

    if (Object.keys(utilityErrors).length > 0) {
      newErrors.utilities = utilityErrors;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext(formData);
    }
  };

  const handleBack = () => {
    onBack();
  };

  const utilityTypes = {
    heatingFuel: ['Electric', 'Gas', 'Oil', 'Propane', 'Other'],
    cookingFuel: ['Electric', 'Gas', 'Oil', 'Propane', 'Other'],
    hotWater: ['Electric', 'Gas', 'Oil', 'Propane', 'Other'],
    water: ['Public', 'Well'],
    sewer: ['Public', 'Septic'],
    coolingSystem: ['Electric', 'Gas', 'Oil', 'Propane', 'Other']
  };

  const handleAmenityChange = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: {
        ...prev.amenities,
        [amenity]: !prev.amenities[amenity as keyof typeof prev.amenities]
      }
    }));
  };

  const handleUtilityChange = (utility: string, field: 'type' | 'paidBy', value: string) => {
    setFormData(prev => ({
      ...prev,
      utilities: {
        ...prev.utilities,
        [utility]: {
          ...prev.utilities[utility as keyof typeof prev.utilities],
          [field]: value
        }
      }
    }));
  };

  const handleConditionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const condition = e.target.value;
    setFormData(prev => ({
      ...prev,
      propertyCondition: condition,
      propertyConditionDescription: conditionDescriptions[condition as keyof typeof conditionDescriptions]
    }));
  };

  return (
    <div className="bg-black rounded-lg p-6">
      <h2 className="text-xl text-white mb-6">Property Details</h2>
      
      <div className="space-y-8">
        <div>
          <h3 className="text-white mb-4">Amenities</h3>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries({
              airConditioning: 'Air Conditioning',
              washerDryer: 'Washer/Dryer',
              dishwasher: 'Dishwasher',
              garage: 'Garage',
              pool: 'Pool',
              gym: 'Gym',
              furnished: 'Furnished',
              balcony: 'Balcony',
              storage: 'Storage',
              securitySystem: 'Security System',
              petFriendly: 'Pet Friendly',
              highSpeedInternet: 'High-Speed Internet',
              washerDryerHookups: 'Washer/Dryer Hookups',
              gatedCommunity: 'Gated Community',
              pestControl: 'Pest Control',
              onSiteMaintenance: 'On-Site Maintenance'
            }).map(([key, label]) => (
              <label key={key} className="flex items-center space-x-2 text-white">
                <input
                  type="checkbox"
                  checked={formData.amenities[key as keyof typeof formData.amenities]}
                  onChange={() => handleAmenityChange(key)}
                  className="rounded bg-gray-800 border-gray-700"
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-white mb-2">
                Property Condition
                <select
                  value={formData.propertyCondition}
                  onChange={handleConditionChange}
                  className={`mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white ${
                    errors.propertyCondition ? 'border border-red-500' : ''
                  }`}
                >
                  <option value="">Select condition</option>
                  <option value="Good">Good</option>
                  <option value="Excellent">Excellent</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor</option>
                </select>
                {errors.propertyCondition && (
                  <p className="text-red-500 text-sm mt-1">{errors.propertyCondition}</p>
                )}
              </label>
              <p className="mt-2 text-sm text-gray-400 italic">
                {formData.propertyConditionDescription}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-white">
              Parking
              <select
                value={formData.parking}
                onChange={(e) => setFormData(prev => ({ ...prev, parking: e.target.value }))}
                className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white"
              >
                <option value="">Select parking type</option>
                <option value="garage">Garage</option>
                <option value="driveway">Driveway</option>
                <option value="street">Street</option>
                <option value="none">None</option>
              </select>
            </label>
          </div>
        </div>

        <div>
          <h3 className="text-white mb-4">Utilities</h3>
          <div className="space-y-4">
            {Object.entries(formData.utilities).map(([key, value]) => (
              <div key={key} className="grid grid-cols-2 gap-4 items-center mb-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    {key !== 'electricity' && '*'}
                  </label>
                </div>
                <div className="flex items-center space-x-4">
                  {key === 'electricity' ? (
                    // Electricity - only radio buttons, no dropdown
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          checked={value.paidBy === 'Owner'}
                          onChange={() => setFormData(prev => ({
                            ...prev,
                            utilities: {
                              ...prev.utilities,
                              [key]: { ...value, paidBy: 'Owner' }
                            }
                          }))}
                          className="mr-2"
                        />
                        <span className="text-white">Owner</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          checked={value.paidBy === 'Tenant'}
                          onChange={() => setFormData(prev => ({
                            ...prev,
                            utilities: {
                              ...prev.utilities,
                              [key]: { ...value, paidBy: 'Tenant' }
                            }
                          }))}
                          className="mr-2"
                        />
                        <span className="text-white">Tenant</span>
                      </label>
                    </div>
                  ) : (
                    // Other utilities - dropdown and radio buttons
                    <>
                      <select
                        value={value.type}
                        onChange={(e) => handleUtilityChange(key, 'type', e.target.value)}
                        className={`w-full bg-gray-800 text-white rounded-md p-2 ${
                          errors.utilities?.[key] ? 'border border-red-500' : ''
                        }`}
                      >
                        <option value="">Select type</option>
                        {utilityTypes[key as keyof typeof utilityTypes]?.map(type => (
                          <option key={type} value={type.toLowerCase()}>{type}</option>
                        ))}
                      </select>
                      <div className="flex items-center space-x-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            checked={value.paidBy === 'Owner'}
                            onChange={() => setFormData(prev => ({
                              ...prev,
                              utilities: {
                                ...prev.utilities,
                                [key]: { ...value, paidBy: 'Owner' }
                              }
                            }))}
                            className="mr-2"
                          />
                          <span className="text-white">Owner</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            checked={value.paidBy === 'Tenant'}
                            onChange={() => setFormData(prev => ({
                              ...prev,
                              utilities: {
                                ...prev.utilities,
                                [key]: { ...value, paidBy: 'Tenant' }
                              }
                            }))}
                            className="mr-2"
                          />
                          <span className="text-white">Tenant</span>
                        </label>
                      </div>
                    </>
                  )}
                </div>
                {errors.utilities?.[key] && (
                  <p className="text-red-500 text-sm mt-1 col-span-2">{errors.utilities[key]}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-between">
          <button
            onClick={handleBack}
            className="px-4 py-2 text-white bg-gray-600 rounded-md hover:bg-gray-700"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
} 
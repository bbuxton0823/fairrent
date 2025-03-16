'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

// Define utility types
interface UtilityInfo {
  type: string;
  responsibility: 'owner' | 'tenant';
}

interface Utilities {
  [key: string]: UtilityInfo;
}

// Define the complete form data structure
interface PropertyFormData {
  // Property Info
  address: string;
  unit?: string;
  propertyType: string;
  beds: string;
  fullBaths: string;
  halfBaths?: string;
  sqft?: string;
  squareFeet?: string;
  yearBuilt?: string;
  quality?: string;
  condition?: string;
  requestedRent: string;
  utilitySchedule?: string;
  
  // Utilities & Amenities
  amenities: string[];
  propertyCondition?: string;
  parkingType?: string;
  parking?: string;
  utilities: Utilities;

  // Location & Neighborhood
  zipCode?: string;
  neighborhood?: string;
  neighborhoodScore?: number | null;
  
  // Allow for additional properties
  [key: string]: any;
}

interface FormContextType {
  formData: PropertyFormData;
  updateFormData: (data: Partial<PropertyFormData>) => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export function FormProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<PropertyFormData>({
    address: '',
    unit: '',
    beds: '',
    fullBaths: '',
    halfBaths: '',
    sqft: '',
    squareFeet: '',
    yearBuilt: '',
    condition: 'Good',
    quality: 'Unknown',
    propertyType: '',
    requestedRent: '',
    parking: '',
    amenities: [],
    propertyCondition: '',
    parkingType: '',
    utilities: {
      'Heating Fuel': { type: '', responsibility: 'owner' },
      'Cooking Fuel': { type: '', responsibility: 'owner' },
      'Hot Water': { type: '', responsibility: 'owner' },
      'Electricity': { type: '', responsibility: 'owner' },
      'Water': { type: '', responsibility: 'owner' },
      'Sewer': { type: '', responsibility: 'owner' },
      'Cooling System': { type: '', responsibility: 'owner' },
    },
    zipCode: '',
    neighborhood: '',
    neighborhoodScore: null,
  });

  const updateFormData = (data: Partial<PropertyFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  return (
    <FormContext.Provider value={{ formData, updateFormData }}>
      {children}
    </FormContext.Provider>
  );
}

export function useFormContext() {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
} 
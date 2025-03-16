'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@auth0/nextjs-auth0/client'
import PropertyInfoStep from './steps/PropertyInfoStep'
import AmenitiesStep from './steps/AmenitiesStep'
import LocationStep from './steps/LocationStep'
import { usePersistedState } from '../../hooks/usePersistedState'

const STEPS = {
  PROPERTY_INFO: 0,
  UTILITIES: 1,
  LOCATION: 2,
  ANALYSIS: 3,
}

// Define the utility types to match AmenitiesStep
interface UtilityInfo {
  type: string;
  responsibility: 'owner' | 'tenant';
}

interface Utilities {
  [key: string]: UtilityInfo;
}

// Define the form data structure
interface FormData {
  // Property Info
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
  
  // Utilities & Amenities
  amenities: string[];
  propertyCondition: string;
  parkingType: string;
  utilities: Utilities;

  // Location & Neighborhood
  zipCode: string;
  neighborhood: string;
  neighborhoodScore: number | null;
}

export default function NewAnalysisPage() {
  const router = useRouter()
  const { user, isLoading, error } = useUser()
  const [currentStep, setCurrentStep] = useState(STEPS.PROPERTY_INFO)
  const [formData, setFormData] = usePersistedState<FormData>('new_analysis_form', {
    // Property Info
    address: '',
    unit: '',
    propertyType: '',
    beds: '',
    fullBaths: '',
    halfBaths: '',
    squareFeet: '',
    yearBuilt: '',
    quality: 'Unknown',
    requestedRent: '',
    
    // Utilities & Amenities
    amenities: [],
    propertyCondition: '',
    parkingType: '',
    utilities: {
      'Heating Fuel': { type: '', responsibility: 'owner' as const },
      'Cooking Fuel': { type: '', responsibility: 'owner' as const },
      'Hot Water': { type: '', responsibility: 'owner' as const },
      'Electricity': { type: '', responsibility: 'owner' as const },
      'Water': { type: '', responsibility: 'owner' as const },
      'Sewer': { type: '', responsibility: 'owner' as const },
      'Cooling System': { type: '', responsibility: 'owner' as const },
    } as Utilities,

    // Location & Neighborhood
    zipCode: '',
    neighborhood: '',
    neighborhoodScore: null,
  })

  // Check authentication
  if (isLoading) return <div>Loading...</div>
  if (!user) {
    router.push('/api/auth/login')
    return null
  }

  const handleNext = (stepData: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...stepData }))
    if (currentStep < STEPS.ANALYSIS) {
      setCurrentStep(prev => prev + 1)
    } else {
      // Submit the final data and navigate to analysis page
      router.push('/dashboard/analysis')
    }
  }

  const handlePrevious = () => {
    if (currentStep > STEPS.PROPERTY_INFO) {
      setCurrentStep(prev => prev - 1)
    } else {
      router.push('/dashboard') // Go back to dashboard/home
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case STEPS.PROPERTY_INFO:
        return (
          <PropertyInfoStep
            onNext={handleNext}
            onPrevious={handlePrevious}
            initialData={formData}
          />
        )
      case STEPS.UTILITIES:
        return (
          <AmenitiesStep
            onNext={handleNext}
            onPrevious={handlePrevious}
            initialData={formData}
            stepNumber={2}
            totalSteps={4}
          />
        )
      case STEPS.LOCATION:
        return (
          <LocationStep
            onNext={handleNext}
            onPrevious={handlePrevious}
            initialData={formData}
            stepNumber={3}
            totalSteps={4}
          />
        )
      default:
        router.push('/dashboard')
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {renderStep()}
      </div>
    </div>
  )
} 
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import type { PropertyFormData } from '@/app/dashboard/new-analysis/types'

function computeRentEstimate(formData: PropertyFormData) {
  // Base rent calculation using square footage
  const baseRent = (parseInt(formData.squareFeet || '0') * 2) || 1000 // $2 per sqft or min $1000

  // Amenity adjustments
  const amenityBoost = (formData.amenities?.length || 0) * 25 // $25 per amenity

  // Age-based adjustment
  const propertyAge = new Date().getFullYear() - (parseInt(formData.yearBuilt || '1990'))
  const agePenalty = Math.max(0, propertyAge - 30) * 5 // $5 penalty per year over 30

  // Quality and condition adjustments
  const qualityMultiplier = formData.quality === 'luxury' ? 1.3 : 
                           formData.quality === 'high' ? 1.15 : 
                           formData.quality === 'low' ? 0.85 : 1

  const conditionMultiplier = formData.propertyCondition === 'excellent' ? 1.1 :
                             formData.propertyCondition === 'poor' ? 0.9 : 1

  // Calculate final range
  const baseEstimate = (baseRent + amenityBoost - agePenalty) * qualityMultiplier * conditionMultiplier
  const minRent = Math.round(baseEstimate * 0.9) // 10% below estimate
  const maxRent = Math.round(baseEstimate * 1.1) // 10% above estimate
  
  // Confidence calculation based on data completeness
  const requiredFields = ['address', 'beds', 'baths', 'squareFeet', 'yearBuilt']
  const optionalFields = ['quality', 'propertyCondition', 'amenities', 'parking']
  const completedRequired = requiredFields.filter(field => formData[field as keyof PropertyFormData]).length
  const completedOptional = optionalFields.filter(field => formData[field as keyof PropertyFormData]).length
  
  const confidence = Math.min(
    85, // max confidence
    (completedRequired / requiredFields.length * 60) + // up to 60% from required fields
    (completedOptional / optionalFields.length * 25)   // up to 25% from optional fields
  )

  return { minRent, maxRent, confidence: Math.round(confidence) }
}

export async function POST(request: Request) {
  try {
    const body: PropertyFormData = await request.json()

    // Validate required fields
    if (!body.address || !body.beds || !body.baths || !body.squareFeet) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Missing required fields: address, beds, baths, and square footage are required.' 
        },
        { status: 400 }
      )
    }

    // Perform analysis
    const { minRent, maxRent, confidence } = computeRentEstimate(body)

    // Create database record
    const newAnalysis = await prisma.analysis.create({
      data: {
        address: body.address,
        beds: parseInt(body.beds),
        baths: parseInt(body.fullBaths || body.baths),
        squareFeet: parseInt(body.squareFeet),
        yearBuilt: parseInt(body.yearBuilt || '1990'),
        amenities: JSON.stringify(body.amenities || []),
        parking: body.parking || null,
        utilitySchedule: body.utilitySchedule || null,
        propertyCondition: body.propertyCondition || null,
        rentEstimateMin: minRent,
        rentEstimateMax: maxRent,
        confidence,
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        ...newAnalysis,
        amenities: JSON.parse(newAnalysis.amenities),
      },
    })
  } catch (error: Error | unknown) {
    console.error('Error in POST /api/analysis:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to process analysis.'
    return NextResponse.json(
      { 
        success: false, 
        message: errorMessage 
      },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Analysis ID is required' },
        { status: 400 }
      )
    }

    // TODO: Implement fetching analysis by ID
    return NextResponse.json(
      { success: false, error: 'Not implemented' },
      { status: 501 }
    )
  } catch (error) {
    console.error('Analysis API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analysis' },
      { status: 500 }
    )
  }
} 
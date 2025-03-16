import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: analysisId } = await params
    const analysis = await prisma.analysis.findUnique({
      where: { id: analysisId },
      select: {
        id: true,
        address: true,
        beds: true,
        baths: true,
        squareFeet: true,
        yearBuilt: true,
        amenities: true,
        parking: true,
        utilitySchedule: true,
        propertyCondition: true,
        rentEstimateMin: true,
        rentEstimateMax: true,
        confidence: true,
        createdAt: true,
      },
    })

    if (!analysis) {
      return NextResponse.json(
        { success: false, message: 'Analysis not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        ...analysis,
        amenities: JSON.parse(analysis.amenities),
      },
    })
  } catch (error: Error | unknown) {
    console.error('Error in GET /api/analysis/[id]:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch analysis.'
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    )
  }
} 
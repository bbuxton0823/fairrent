import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    // Check if API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      );
    }

    // Parse request body
    const body = await request.json();
    
    // Validate required fields
    if (!body.propertyType || !body.beds || !body.baths) {
      return NextResponse.json(
        { error: 'Missing required property information' },
        { status: 400 }
      );
    }

    // Construct the prompt for OpenAI
    const prompt = `
      Create a compelling marketing description for the following property:
      
      Property Type: ${body.propertyType}
      Bedrooms: ${body.beds}
      Bathrooms: ${body.baths}
      Square Feet: ${body.squareFeet || 'Not specified'}
      Location/Neighborhood: ${body.location || 'Not specified'}
      
      Amenities: ${body.amenities?.length > 0 ? body.amenities.join(', ') : 'None specified'}
      Nearby Attractions: ${body.nearbyAttractions || 'Not specified'}
      
      Please provide:
      1. An attention-grabbing title for the listing
      2. A detailed, compelling description that highlights the property's features and benefits
      
      Format the response as JSON with the following structure:
      {
        "title": string,
        "description": string
      }
    `;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a professional real estate copywriter specializing in creating compelling property descriptions. Create engaging, descriptive, and persuasive content that highlights the best features of properties. Always format your response as valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    });

    // Parse the response
    const responseContent = completion.choices[0].message.content;
    if (!responseContent) {
      throw new Error('No response from OpenAI');
    }

    // Parse JSON response
    const description = JSON.parse(responseContent);

    // Return the property description
    return NextResponse.json(description);
  } catch (error) {
    console.error('Error in property description generation:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
} 
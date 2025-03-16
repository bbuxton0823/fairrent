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
    if (!body.state || !body.city || !body.currentRent || !body.proposedRent) {
      return NextResponse.json(
        { error: 'Missing required compliance information' },
        { status: 400 }
      );
    }

    // Calculate rent increase percentage
    const currentRent = parseFloat(body.currentRent);
    const proposedRent = parseFloat(body.proposedRent);
    const increaseAmount = proposedRent - currentRent;
    const increasePercentage = (increaseAmount / currentRent) * 100;

    // Construct the prompt for OpenAI
    const prompt = `
      Analyze the compliance of the following rent increase with local rent control laws:
      
      Location: ${body.city}, ${body.state}
      Current Rent: $${currentRent.toFixed(2)}
      Proposed Rent: $${proposedRent.toFixed(2)}
      Increase Amount: $${increaseAmount.toFixed(2)}
      Increase Percentage: ${increasePercentage.toFixed(2)}%
      Tenancy Start Date: ${body.tenancyStartDate || 'Not specified'}
      
      Please provide:
      1. Whether this rent increase complies with local rent control laws
      2. The maximum allowable increase under local laws
      3. Specific regulations that apply to this situation
      4. Recommendations for ensuring compliance
      
      Format the response as JSON with the following structure:
      {
        "compliant": boolean,
        "maxAllowableIncrease": {
          "percentage": number,
          "amount": number
        },
        "applicableRegulations": [string],
        "recommendations": [string],
        "explanation": string
      }
    `;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a legal expert specializing in rental law and tenant rights. Provide detailed, accurate analysis of rent increase compliance based on local regulations. Always format your response as valid JSON."
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
    const compliance = JSON.parse(responseContent);

    // Return the compliance analysis
    return NextResponse.json(compliance);
  } catch (error) {
    console.error('Error in rent compliance check:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
} 
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function GET() {
  try {
    // Check if API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'OpenAI API key is not configured',
          keyExists: false
        },
        { status: 500 }
      );
    }

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Make a simple API call to test the connection
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant."
        },
        {
          role: "user",
          content: "Say 'OpenAI connection successful!' if you can read this message."
        }
      ],
      max_tokens: 50
    });

    // Return success response
    return NextResponse.json({
      success: true,
      message: completion.choices[0].message.content,
      model: process.env.OPENAI_MODEL || "gpt-4o",
      keyExists: true,
      keyFirstChars: process.env.OPENAI_API_KEY.substring(0, 7) + '...',
      usage: completion.usage
    });
  } catch (error) {
    console.error('Error testing OpenAI connection:', error);
    
    // Return detailed error information
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'An unknown error occurred',
        keyExists: !!process.env.OPENAI_API_KEY,
        keyFirstChars: process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.substring(0, 7) + '...' : 'not found'
      },
      { status: 500 }
    );
  }
} 
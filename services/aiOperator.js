import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function validatePropertyData(data) {
  const prompt = `
    Please validate the following property data and identify any potential issues or inconsistencies:
    
    Address: ${data.address}
    Property Type: ${data.propertyType}
    Bedrooms: ${data.beds}
    Bathrooms: ${data.baths}
    Square Footage: ${data.sqft}
    Year Built: ${data.yearBuilt}
    Requested Rent: ${data.requestedRent}
    
    Please analyze this data and:
    1. Check for any missing or invalid values
    2. Identify any unusual or potentially incorrect values
    3. Suggest any necessary corrections
    4. Provide a confidence score for the data quality (0-100)
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are a real estate data validation expert. Analyze property data for accuracy and completeness."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.3,
  });

  return parseValidationResponse(response.choices[0].message.content);
}

export async function generateMarketInsights(propertyData, comparables) {
  const prompt = `
    Please analyze the following property and its comparables to generate market insights:
    
    Subject Property:
    ${JSON.stringify(propertyData, null, 2)}
    
    Comparable Properties:
    ${JSON.stringify(comparables, null, 2)}
    
    Please provide:
    1. Key market trends
    2. Competitive advantages/disadvantages
    3. Suggested pricing strategy
    4. Risk factors to consider
    5. Recommendations for property improvements
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are a real estate market analysis expert. Provide detailed insights and recommendations."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.5,
  });

  return parseMarketInsights(response.choices[0].message.content);
}

export async function generatePropertyDescription(propertyData) {
  const prompt = `
    Please generate a professional property description based on the following data:
    
    ${JSON.stringify(propertyData, null, 2)}
    
    Requirements:
    1. Professional and engaging tone
    2. Highlight key features and amenities
    3. Include location benefits
    4. Mention any unique selling points
    5. Keep it concise but comprehensive
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are a professional real estate copywriter. Create compelling property descriptions."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.7,
  });

  return response.choices[0].message.content;
}

function parseValidationResponse(content) {
  // Implement parsing logic for validation response
  // This is a simplified example
  const lines = content.split('\n');
  const issues = [];
  let confidenceScore = 0;

  lines.forEach(line => {
    if (line.toLowerCase().includes('issue:')) {
      issues.push(line.split('issue:')[1].trim());
    }
    if (line.toLowerCase().includes('confidence score:')) {
      confidenceScore = parseInt(line.split('confidence score:')[1].trim());
    }
  });

  return {
    issues,
    confidenceScore,
    isValid: confidenceScore >= 70
  };
}

function parseMarketInsights(content) {
  // Implement parsing logic for market insights
  // This is a simplified example
  const sections = content.split('\n\n');
  
  return {
    trends: extractSection(sections, 'trends'),
    competitiveAnalysis: extractSection(sections, 'competitive'),
    pricingStrategy: extractSection(sections, 'pricing'),
    riskFactors: extractSection(sections, 'risk'),
    recommendations: extractSection(sections, 'recommendations')
  };
}

function extractSection(sections, keyword) {
  const section = sections.find(s => s.toLowerCase().includes(keyword));
  return section ? section.split('\n').slice(1) : [];
} 
/**
 * AI Utilities for FairRent
 * 
 * This file contains utility functions for working with AI in the application.
 * It demonstrates how to load and use the prompt templates defined in the documentation.
 */

const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai'); // Assuming OpenAI package is installed

// Path to prompt templates
const PROMPT_TEMPLATES_PATH = path.join(__dirname, 'prompt_templates.md');

// Initialize OpenAI client (in a real app, use environment variables for the API key)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'your-api-key',
});

/**
 * Load a specific prompt template from the documentation
 * @param {string} templateName - The name of the template to load (e.g., "Property Analysis Template")
 * @returns {string|null} The template content or null if not found
 */
function loadPromptTemplate(templateName) {
  try {
    const promptTemplatesContent = fs.readFileSync(PROMPT_TEMPLATES_PATH, 'utf8');
    const templateMatch = promptTemplatesContent.match(
      new RegExp(`### ${templateName}\\s+\`\`\`\\s+([\\s\\S]*?)\`\`\``)
    );
    
    if (!templateMatch || !templateMatch[1]) {
      console.error(`Template "${templateName}" not found`);
      return null;
    }
    
    return templateMatch[1].trim();
  } catch (error) {
    console.error(`Error loading template: ${error.message}`);
    return null;
  }
}

/**
 * Fill a template with data
 * @param {string} template - The template string with placeholders
 * @param {Object} data - The data to fill the template with
 * @returns {string} The filled template
 */
function fillTemplate(template, data) {
  let filledTemplate = template;
  
  Object.entries(data).forEach(([key, value]) => {
    filledTemplate = filledTemplate.replace(
      new RegExp(`\\{${key}\\}`, 'g'), 
      value
    );
  });
  
  return filledTemplate;
}

/**
 * Generate a rent analysis using the OpenAI API
 * @param {Object} propertyData - The property data to analyze
 * @returns {Promise<Object>} The analysis result
 */
async function generateRentAnalysis(propertyData) {
  try {
    // Load the Property Analysis Template
    const template = loadPromptTemplate('Property Analysis Template');
    if (!template) {
      throw new Error('Failed to load Property Analysis Template');
    }
    
    // Fill the template with property data
    const prompt = fillTemplate(template, propertyData);
    
    // Call the OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-4', // Use an appropriate model
      messages: [
        { role: 'system', content: 'You are a real estate analysis expert.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.5,
      max_tokens: 1000,
    });
    
    // Process and return the response
    return {
      analysis: response.choices[0].message.content,
      usage: response.usage,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error(`Error generating rent analysis: ${error.message}`);
    throw error;
  }
}

/**
 * Check compliance with rent control laws
 * @param {Object} rentData - The rent data to check
 * @returns {Promise<Object>} The compliance check result
 */
async function checkRentCompliance(rentData) {
  try {
    // Load the Rent Control Verification Template
    const template = loadPromptTemplate('Rent Control Verification Template');
    if (!template) {
      throw new Error('Failed to load Rent Control Verification Template');
    }
    
    // Fill the template with rent data
    const prompt = fillTemplate(template, rentData);
    
    // Call the OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-4', // Use an appropriate model
      messages: [
        { role: 'system', content: 'You are a rent control compliance expert.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 800,
    });
    
    // Process and return the response
    return {
      compliance: response.choices[0].message.content,
      usage: response.usage,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error(`Error checking rent compliance: ${error.message}`);
    throw error;
  }
}

/**
 * Generate a property description for marketing
 * @param {Object} propertyDetails - The property details
 * @returns {Promise<Object>} The generated description
 */
async function generatePropertyDescription(propertyDetails) {
  try {
    // Load the Marketing Description Template
    const template = loadPromptTemplate('Marketing Description Template');
    if (!template) {
      throw new Error('Failed to load Marketing Description Template');
    }
    
    // Fill the template with property details
    const prompt = fillTemplate(template, propertyDetails);
    
    // Call the OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-4', // Use an appropriate model
      messages: [
        { role: 'system', content: 'You are a real estate marketing expert.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });
    
    // Process and return the response
    return {
      description: response.choices[0].message.content,
      usage: response.usage,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error(`Error generating property description: ${error.message}`);
    throw error;
  }
}

// Example usage
async function example() {
  // Example property data
  const propertyData = {
    address: '123 Main St',
    propertyType: 'Single Family Home',
    squareFeet: 1500,
    beds: 3,
    fullBaths: 2,
    halfBaths: 1,
    yearBuilt: 2005,
    quality: 'Good',
    amenities: 'Garage, Fireplace, Deck',
    zipCode: '12345',
    neighborhood: 'Downtown'
  };
  
  try {
    console.log('Generating rent analysis...');
    const analysis = await generateRentAnalysis(propertyData);
    console.log('Analysis result:', analysis);
    
    // Example rent data
    const rentData = {
      zipCode: '12345',
      currentRent: 1500,
      proposedRent: 1650,
      lastIncreaseDate: '2022-06-01',
      tenantYears: 2
    };
    
    console.log('\nChecking rent compliance...');
    const compliance = await checkRentCompliance(rentData);
    console.log('Compliance result:', compliance);
    
    // Example property details for marketing
    const marketingDetails = {
      propertyDetails: JSON.stringify(propertyData),
      targetMarket: 'Young professionals and small families',
      uniqueFeatures: 'Recently renovated kitchen, smart home features, energy-efficient appliances'
    };
    
    console.log('\nGenerating property description...');
    const description = await generatePropertyDescription(marketingDetails);
    console.log('Description result:', description);
    
  } catch (error) {
    console.error('Example failed:', error);
  }
}

// Export functions for use in the application
module.exports = {
  loadPromptTemplate,
  fillTemplate,
  generateRentAnalysis,
  checkRentCompliance,
  generatePropertyDescription,
  example
}; 
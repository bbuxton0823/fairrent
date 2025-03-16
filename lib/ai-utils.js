import fs from 'fs';
import path from 'path';
import { generateCompletion } from './openai';

// Path to prompt templates
const PROMPT_TEMPLATES_PATH = path.join(process.cwd(), 'doc', 'prompt_templates.md');

/**
 * Load a specific prompt template from the documentation
 * @param {string} templateName - The name of the template to load (e.g., "Property Analysis Template")
 * @returns {string|null} The template content or null if not found
 */
export function loadPromptTemplate(templateName) {
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
export function fillTemplate(template, data) {
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
export async function generateRentAnalysis(propertyData) {
  try {
    // Load the Property Analysis Template
    const template = loadPromptTemplate('Property Analysis Template');
    if (!template) {
      throw new Error('Failed to load Property Analysis Template');
    }
    
    // Fill the template with property data
    const prompt = fillTemplate(template, propertyData);
    
    // Call the OpenAI API
    const systemPrompt = 'You are a real estate analysis expert with deep knowledge of rental markets.';
    const response = await generateCompletion(systemPrompt, prompt, {
      temperature: 0.5,
      maxTokens: 1000,
    });
    
    // Process and return the response
    return {
      analysis: response.content,
      usage: response.usage,
      timestamp: response.timestamp,
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
export async function checkRentCompliance(rentData) {
  try {
    // Load the Rent Control Verification Template
    const template = loadPromptTemplate('Rent Control Verification Template');
    if (!template) {
      throw new Error('Failed to load Rent Control Verification Template');
    }
    
    // Fill the template with rent data
    const prompt = fillTemplate(template, rentData);
    
    // Call the OpenAI API
    const systemPrompt = 'You are a rent control compliance expert with knowledge of local, state, and federal regulations.';
    const response = await generateCompletion(systemPrompt, prompt, {
      temperature: 0.3,
      maxTokens: 800,
    });
    
    // Process and return the response
    return {
      compliance: response.content,
      usage: response.usage,
      timestamp: response.timestamp,
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
export async function generatePropertyDescription(propertyDetails) {
  try {
    // Load the Marketing Description Template
    const template = loadPromptTemplate('Marketing Description Template');
    if (!template) {
      throw new Error('Failed to load Marketing Description Template');
    }
    
    // Fill the template with property details
    const prompt = fillTemplate(template, propertyDetails);
    
    // Call the OpenAI API
    const systemPrompt = 'You are a real estate marketing expert skilled at creating compelling property descriptions.';
    const response = await generateCompletion(systemPrompt, prompt, {
      temperature: 0.7,
      maxTokens: 500,
    });
    
    // Process and return the response
    return {
      description: response.content,
      usage: response.usage,
      timestamp: response.timestamp,
    };
  } catch (error) {
    console.error(`Error generating property description: ${error.message}`);
    throw error;
  }
}

/**
 * Validate property data for completeness and reasonableness
 * @param {Object} propertyData - The property data to validate
 * @returns {Promise<Object>} The validation result
 */
export async function validatePropertyData(propertyData) {
  try {
    // Load the Input Validation Template
    const template = loadPromptTemplate('Input Validation Template');
    if (!template) {
      throw new Error('Failed to load Input Validation Template');
    }
    
    // Fill the template with property data
    const prompt = fillTemplate(template, {
      propertyData: JSON.stringify(propertyData, null, 2)
    });
    
    // Call the OpenAI API
    const systemPrompt = 'You are a data validation expert for real estate information.';
    const response = await generateCompletion(systemPrompt, prompt, {
      temperature: 0.2,
      maxTokens: 600,
    });
    
    // Process and return the response
    return {
      validation: response.content,
      isValid: !response.content.includes('ERROR') && !response.content.includes('INVALID'),
      usage: response.usage,
      timestamp: response.timestamp,
    };
  } catch (error) {
    console.error(`Error validating property data: ${error.message}`);
    throw error;
  }
} 
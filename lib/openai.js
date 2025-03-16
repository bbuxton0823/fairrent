import { OpenAI } from 'openai';

// Initialize OpenAI client with API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Default model to use for completions
const defaultModel = process.env.OPENAI_MODEL || 'gpt-4';

/**
 * Generate a completion using OpenAI
 * 
 * @param {string} systemPrompt - The system prompt to set context
 * @param {string} userPrompt - The user prompt to generate a completion for
 * @param {Object} options - Additional options for the completion
 * @returns {Promise<Object>} The completion response
 */
export async function generateCompletion(systemPrompt, userPrompt, options = {}) {
  try {
    const response = await openai.chat.completions.create({
      model: options.model || defaultModel,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens || 1000,
    });

    return {
      content: response.choices[0].message.content,
      usage: response.usage,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error generating completion:', error);
    throw new Error(`OpenAI API error: ${error.message}`);
  }
}

export default openai; 
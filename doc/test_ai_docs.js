/**
 * Test script to validate AI documentation files
 * This script checks that the AI rules and prompt templates are properly formatted
 * and can be used in the application.
 */

const fs = require('fs');
const path = require('path');

// Paths to documentation files
const AI_RULES_PATH = path.join(__dirname, 'ai_rules.md');
const PROMPT_TEMPLATES_PATH = path.join(__dirname, 'prompt_templates.md');

// Test function to validate AI rules document
function testAIRules() {
  console.log('Testing AI Rules document...');
  
  try {
    // Read the AI rules file
    const aiRulesContent = fs.readFileSync(AI_RULES_PATH, 'utf8');
    
    // Check if file exists and has content
    if (!aiRulesContent || aiRulesContent.length === 0) {
      console.error('❌ AI Rules document is empty or missing');
      return false;
    }
    
    // Check for required sections
    const requiredSections = [
      '# AI Integration Rules and Guidelines',
      '## Core AI Features',
      '## AI Implementation Guidelines',
      '## Best Practices',
      '## Security Considerations'
    ];
    
    const missingSection = requiredSections.find(section => !aiRulesContent.includes(section));
    if (missingSection) {
      console.error(`❌ Missing required section: ${missingSection}`);
      return false;
    }
    
    console.log('✅ AI Rules document is valid');
    return true;
  } catch (error) {
    console.error(`❌ Error testing AI Rules: ${error.message}`);
    return false;
  }
}

// Test function to validate prompt templates document
function testPromptTemplates() {
  console.log('Testing Prompt Templates document...');
  
  try {
    // Read the prompt templates file
    const promptTemplatesContent = fs.readFileSync(PROMPT_TEMPLATES_PATH, 'utf8');
    
    // Check if file exists and has content
    if (!promptTemplatesContent || promptTemplatesContent.length === 0) {
      console.error('❌ Prompt Templates document is empty or missing');
      return false;
    }
    
    // Check for required sections
    const requiredSections = [
      '# AI Prompt Templates',
      '## Rent Analysis Prompts',
      '## Compliance Check Prompts',
      '## Property Summary Prompts'
    ];
    
    const missingSection = requiredSections.find(section => !promptTemplatesContent.includes(section));
    if (missingSection) {
      console.error(`❌ Missing required section: ${missingSection}`);
      return false;
    }
    
    // Check for template code blocks
    const codeBlockCount = (promptTemplatesContent.match(/```(?:[\s\S]*?)```/g) || []).length;
    if (codeBlockCount < 5) {
      console.error(`❌ Expected at least 5 template code blocks, found ${codeBlockCount}`);
      return false;
    }
    
    // Check for variable placeholders
    const variablePlaceholders = promptTemplatesContent.match(/\{[a-zA-Z]+\}/g) || [];
    if (variablePlaceholders.length < 10) {
      console.error(`❌ Expected at least 10 variable placeholders, found ${variablePlaceholders.length}`);
      return false;
    }
    
    console.log('✅ Prompt Templates document is valid');
    return true;
  } catch (error) {
    console.error(`❌ Error testing Prompt Templates: ${error.message}`);
    return false;
  }
}

// Test function to extract and validate a specific prompt template
function testExtractPrompt() {
  console.log('Testing prompt extraction...');
  
  try {
    // Read the prompt templates file
    const promptTemplatesContent = fs.readFileSync(PROMPT_TEMPLATES_PATH, 'utf8');
    
    // Extract the Property Analysis Template
    const propertyAnalysisMatch = promptTemplatesContent.match(/### Property Analysis Template\s+```\s+([\s\S]*?)```/);
    
    if (!propertyAnalysisMatch || !propertyAnalysisMatch[1]) {
      console.error('❌ Could not extract Property Analysis Template');
      return false;
    }
    
    const propertyAnalysisTemplate = propertyAnalysisMatch[1].trim();
    
    // Test the template with sample data
    const sampleData = {
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
    
    // Replace placeholders with sample data
    let filledTemplate = propertyAnalysisTemplate;
    Object.entries(sampleData).forEach(([key, value]) => {
      filledTemplate = filledTemplate.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
    });
    
    // Check if all placeholders were replaced
    const remainingPlaceholders = filledTemplate.match(/\{[a-zA-Z]+\}/g);
    if (remainingPlaceholders && remainingPlaceholders.length > 0) {
      console.error(`❌ Template still contains placeholders: ${remainingPlaceholders.join(', ')}`);
      return false;
    }
    
    console.log('✅ Successfully extracted and filled Property Analysis Template');
    console.log('\nSample filled template:');
    console.log('------------------------');
    console.log(filledTemplate);
    
    return true;
  } catch (error) {
    console.error(`❌ Error extracting prompt: ${error.message}`);
    return false;
  }
}

// Run all tests
function runAllTests() {
  console.log('=== TESTING AI DOCUMENTATION ===\n');
  
  const aiRulesValid = testAIRules();
  console.log('');
  
  const promptTemplatesValid = testPromptTemplates();
  console.log('');
  
  const extractPromptValid = testExtractPrompt();
  console.log('\n');
  
  if (aiRulesValid && promptTemplatesValid && extractPromptValid) {
    console.log('✅ All tests passed! Documentation is valid and ready for use.');
  } else {
    console.log('❌ Some tests failed. Please review the errors above.');
  }
}

// Execute tests
runAllTests(); 
/**
 * Example script to demonstrate AI utilities
 * 
 * This script demonstrates how the AI utilities would work
 * with mock responses to avoid actual API calls.
 */

const fs = require('fs');
const path = require('path');

// Load the prompt templates
const PROMPT_TEMPLATES_PATH = path.join(__dirname, 'prompt_templates.md');

/**
 * Load a specific prompt template from the documentation
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
 * Generate a rent analysis (mock implementation)
 */
async function generateRentAnalysis(propertyData) {
  console.log('\n📊 RENT ANALYSIS REQUEST');
  console.log('------------------------');
  
  // Load the Property Analysis Template
  const template = loadPromptTemplate('Property Analysis Template');
  if (!template) {
    throw new Error('Failed to load Property Analysis Template');
  }
  
  // Fill the template with property data
  const prompt = fillTemplate(template, propertyData);
  
  console.log('Prompt that would be sent to OpenAI:');
  console.log('-----------------------------------');
  console.log(prompt);
  console.log('-----------------------------------');
  
  // Return mock analysis
  return {
    analysis: `
Based on the provided property details, I estimate the following:

RENT ESTIMATE: $2,100 - $2,400 per month
CONFIDENCE SCORE: 85/100

KEY FACTORS AFFECTING PRICE:
1. Location in Downtown (12345) is highly desirable
2. Good condition with 3 beds, 2.5 baths is optimal for the area
3. Built in 2005, making it relatively modern
4. Desirable amenities including garage and fireplace
5. Current market trends show strong demand in this area

MARKET POSITION ANALYSIS:
This property is positioned in the upper-middle segment of the local rental market. 
Similar properties in the area are renting for $2,000-$2,500. 
The property's condition and amenities justify a price point near the higher end of this range.
    `,
    usage: { prompt_tokens: 250, completion_tokens: 350, total_tokens: 600 },
    timestamp: new Date().toISOString(),
  };
}

/**
 * Check compliance with rent control laws (mock implementation)
 */
async function checkRentCompliance(rentData) {
  console.log('\n⚖️ COMPLIANCE CHECK REQUEST');
  console.log('---------------------------');
  
  // Load the Rent Control Verification Template
  const template = loadPromptTemplate('Rent Control Verification Template');
  if (!template) {
    throw new Error('Failed to load Rent Control Verification Template');
  }
  
  // Fill the template with rent data
  const prompt = fillTemplate(template, rentData);
  
  console.log('Prompt that would be sent to OpenAI:');
  console.log('-----------------------------------');
  console.log(prompt);
  console.log('-----------------------------------');
  
  // Return mock compliance check
  return {
    compliance: `
COMPLIANCE ANALYSIS:

Based on the rent control regulations in ZIP code 12345:

1. COMPLIANCE STATUS: ✅ COMPLIANT
   The proposed rent increase from $1,500 to $1,650 (10% increase) is within the 
   allowable annual limit of 10% for this jurisdiction.

2. NOTICE REQUIREMENTS:
   A 60-day written notice is required for this increase amount.

3. TIMING CONSIDERATIONS:
   The last increase was on 2022-06-01, which is more than 12 months ago,
   satisfying the minimum time between increases.

4. TENANT DURATION IMPACT:
   The tenant has been in the property for 2 years, which does not trigger
   any special protections in this jurisdiction.

RECOMMENDATION:
Proceed with the increase, ensuring proper written notice is provided at least
60 days before the effective date.
    `,
    usage: { prompt_tokens: 200, completion_tokens: 300, total_tokens: 500 },
    timestamp: new Date().toISOString(),
  };
}

/**
 * Generate a property description for marketing (mock implementation)
 */
async function generatePropertyDescription(propertyDetails) {
  console.log('\n📝 PROPERTY DESCRIPTION REQUEST');
  console.log('-------------------------------');
  
  // Load the Marketing Description Template
  const template = loadPromptTemplate('Marketing Description Template');
  if (!template) {
    throw new Error('Failed to load Marketing Description Template');
  }
  
  // Fill the template with property details
  const prompt = fillTemplate(template, propertyDetails);
  
  console.log('Prompt that would be sent to OpenAI:');
  console.log('-----------------------------------');
  console.log(prompt);
  console.log('-----------------------------------');
  
  // Return mock description
  return {
    description: `
CHARMING DOWNTOWN HOME WITH MODERN AMENITIES

Welcome to this delightful 3-bedroom, 2.5-bathroom single-family home in the heart of Downtown. 
Offering 1,500 square feet of thoughtfully designed living space, this 2005-built property 
presents the perfect blend of comfort and convenience.

Step inside to discover a well-maintained home featuring a cozy fireplace, perfect for those 
relaxing evenings. The attached garage provides secure parking and additional storage space. 
Enjoy outdoor living on the spacious deck, ideal for entertaining or unwinding after a long day.

Recently updated with a modern kitchen featuring smart home technology and energy-efficient 
appliances, this property offers both style and sustainability. The prime Downtown location 
puts you within walking distance of restaurants, shops, and entertainment options.

Perfect for young professionals or small families seeking a turnkey property in a vibrant 
neighborhood. Don't miss this opportunity to make this house your home!
    `,
    usage: { prompt_tokens: 180, completion_tokens: 250, total_tokens: 430 },
    timestamp: new Date().toISOString(),
  };
}

/**
 * Run example
 */
async function runExample() {
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
    console.log('\nAnalysis result:');
    console.log(analysis.analysis);
    
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
    console.log('\nCompliance result:');
    console.log(compliance.compliance);
    
    // Example property details for marketing
    const marketingDetails = {
      propertyDetails: JSON.stringify(propertyData),
      targetMarket: 'Young professionals and small families',
      uniqueFeatures: 'Recently renovated kitchen, smart home features, energy-efficient appliances'
    };
    
    console.log('\nGenerating property description...');
    const description = await generatePropertyDescription(marketingDetails);
    console.log('\nDescription result:');
    console.log(description.description);
    
    return true;
  } catch (error) {
    console.error('Example failed:', error);
    return false;
  }
}

// Run the example
console.log('🏠 FAIRRENT AI UTILITIES DEMO');
console.log('============================');
console.log('Running example with mock API responses...\n');

runExample()
  .then(success => {
    if (success) {
      console.log('\n✅ Example completed successfully!');
      console.log('\nNOTE: This demo used mock responses to avoid actual API calls.');
      console.log('In a real application, you would need to provide a valid OpenAI API key.');
    } else {
      console.log('\n❌ Example failed. See errors above.');
    }
  }); 
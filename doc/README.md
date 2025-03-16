# FairRent AI Documentation

This directory contains documentation and utilities for AI integration in the FairRent application.

## Contents

### Documentation Files

- **[ai_rules.md](./ai_rules.md)**: Comprehensive guidelines for AI integration in the application, including:
  - Core AI features
  - Implementation guidelines
  - Best practices
  - Security considerations
  - Compliance and ethics
  - Maintenance procedures

- **[prompt_templates.md](./prompt_templates.md)**: Standardized prompt templates for various AI features:
  - Rent analysis
  - Compliance checks
  - Property summaries
  - Data validation
  - User communication

### Utility Files

- **[ai_utils.js](./ai_utils.js)**: Utility functions for working with AI in the application:
  - Loading prompt templates
  - Filling templates with data
  - Generating rent analyses
  - Checking rent compliance
  - Creating property descriptions

- **[test_ai_docs.js](./test_ai_docs.js)**: Test script to validate the AI documentation:
  - Checks for required sections
  - Validates prompt templates
  - Tests template extraction and filling

### Example Files

- **[run_example.js](./run_example.js)**: Demonstrates how to use the AI utilities with mock responses:
  - Loads and fills prompt templates
  - Shows the expected format of AI responses
  - Simulates API calls without requiring an OpenAI API key

- **[next_integration_example.js](./next_integration_example.js)**: Shows how to integrate AI utilities in a Next.js application:
  - API route examples for rent analysis and compliance checks
  - React component example for displaying AI-generated content
  - Error handling and loading states

## Usage

### Running Tests

To validate the documentation, run:

```bash
node test_ai_docs.js
```

### Running the Example

To see the AI utilities in action with mock responses, run:

```bash
node run_example.js
```

### Using AI Utilities

To use the AI utilities in your application:

```javascript
const aiUtils = require('./doc/ai_utils');

// Generate a rent analysis
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

aiUtils.generateRentAnalysis(propertyData)
  .then(result => console.log(result))
  .catch(error => console.error(error));
```

### Next.js Integration

To integrate with Next.js, see the examples in `next_integration_example.js`. The key steps are:

1. Import the AI utilities in your API route
2. Create API endpoints for each AI feature
3. Use React components to display the AI-generated content

## Maintenance

When updating AI features:

1. Update the relevant prompt templates in `prompt_templates.md`
2. Run the test script to validate changes: `node test_ai_docs.js`
3. Update the AI utilities if necessary
4. Document any changes in the AI rules document

## Requirements

- Node.js 14+
- OpenAI API key (for using the AI utilities in production)

## Contributing

When adding new AI features:

1. Add appropriate prompt templates to `prompt_templates.md`
2. Update the AI rules in `ai_rules.md` if necessary
3. Add utility functions to `ai_utils.js`
4. Update tests in `test_ai_docs.js` 
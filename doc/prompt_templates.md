# AI Prompt Templates

## Overview
This document contains standardized prompt templates for various AI features in the FairRent application. These templates ensure consistent and effective communication with AI models.

## Rent Analysis Prompts

### Property Analysis Template
```
Analyze the following property details and provide a rent estimate:
Property: {address}
Type: {propertyType}
Size: {squareFeet} sq ft
Bedrooms: {beds}
Bathrooms: {fullBaths} full, {halfBaths} half
Year Built: {yearBuilt}
Condition: {quality}
Amenities: {amenities}
Location: {zipCode}, {neighborhood}

Consider:
1. Local market conditions
2. Comparable properties
3. Property features and condition
4. Seasonal factors
5. Market trends

Required output:
1. Estimated rent range
2. Confidence score (0-100)
3. Key factors affecting price
4. Market position analysis
```

### Market Trend Analysis Template
```
Analyze market trends for the following area:
Location: {zipCode}
Time Period: Last 12 months

Provide:
1. Rent price trends
2. Vacancy rates
3. Seasonal patterns
4. Market demand indicators
5. Future projections (6-12 months)
```

## Compliance Check Prompts

### Rent Control Verification Template
```
Verify compliance with rent control regulations:
Location: {zipCode}
Current Rent: ${currentRent}
Proposed Rent: ${proposedRent}
Last Increase Date: {lastIncreaseDate}
Tenant Duration: {tenantYears} years

Check against:
1. Local rent control laws
2. Annual increase limits
3. Notice requirements
4. Special circumstances
```

### Fair Housing Compliance Template
```
Review the following listing for fair housing compliance:
Listing Text: {listingText}

Check for:
1. Discriminatory language
2. Protected class references
3. Illegal preferences
4. Required disclosures
```

## Property Summary Prompts

### Marketing Description Template
```
Generate a professional property description:
Property Details: {propertyDetails}
Target Market: {targetMarket}
Unique Features: {uniqueFeatures}

Requirements:
1. Professional tone
2. Highlight key features
3. Include location benefits
4. Mention unique selling points
5. Comply with fair housing
```

### Comparative Analysis Template
```
Compare the subject property with market comparables:
Subject Property: {propertyDetails}
Comparable Properties: {comparables}

Analyze:
1. Price positioning
2. Feature differences
3. Location factors
4. Market advantages
5. Value propositions
```

## Data Validation Prompts

### Input Validation Template
```
Validate the following property data:
{propertyData}

Check for:
1. Data completeness
2. Value reasonableness
3. Internal consistency
4. Market alignment
5. Potential errors
```

### Data Correction Template
```
Suggest corrections for the following data issues:
{dataIssues}

Provide:
1. Specific corrections
2. Reasoning
3. Data sources
4. Confidence level
```

## User Communication Prompts

### Error Explanation Template
```
Explain the following error to the user:
Error: {errorDetails}

Requirements:
1. Clear explanation
2. Action steps
3. User-friendly language
4. Additional resources
```

### Feature Explanation Template
```
Explain the following feature to the user:
Feature: {featureName}
Context: {userContext}

Include:
1. Main benefits
2. How to use
3. Limitations
4. Best practices
```

## Maintenance Notes

1. Update prompts regularly based on:
   - User feedback
   - Performance metrics
   - New features
   - Compliance changes

2. Test new prompts for:
   - Accuracy
   - Consistency
   - Bias
   - Performance

3. Version control:
   - Document changes
   - Track effectiveness
   - Maintain backwards compatibility 
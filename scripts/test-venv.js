#!/usr/bin/env node

// Load environment variables
require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });
const { exec, spawn } = require('child_process');
const path = require('path');

// Get the current working directory
const cwd = process.cwd();

// Get the Rentcast API key from environment
const rentcastApiKey = process.env.RENTCAST_API_KEY;

// Sample property data
const propertyData = {
  address: "123 Main St",
  city: "San Francisco",
  state: "CA",
  zipCode: "94105",
  beds: 2,
  baths: 2,
  squareFeet: 1200,
  propertyType: "apartment",
  yearBuilt: "2010",
  amenities: ["Parking", "Dishwasher", "Washer/Dryer"]
};

// Run the Python script in the virtual environment
const pythonProcess = spawn(path.join(process.cwd(), 'venv', 'bin', 'python'), [
  path.join(__dirname, 'rentcast_agent.py')
]);

// Send the property data to the Python script
pythonProcess.stdin.write(JSON.stringify(propertyData));
pythonProcess.stdin.end();

// Collect stdout data
let stdout = '';
pythonProcess.stdout.on('data', (data) => {
  stdout += data.toString();
});

// Collect stderr data
let stderr = '';
pythonProcess.stderr.on('data', (data) => {
  stderr += data.toString();
});

// Handle process completion
pythonProcess.on('close', (code) => {
  console.log(`Python process exited with code ${code}`);
  
  if (stderr) {
    console.error('Error output:');
    console.error(stderr);
  }
  
  // Check if there was an API error in the output
  if (stdout.includes("Error calling Rentcast API")) {
    console.log("API Error detected. The script fell back to using mock data.");
  }
  
  try {
    // Try to find the JSON part of the output
    let jsonOutput = stdout.trim();
    
    // Parse the analysis result
    const analysisResult = JSON.parse(jsonOutput);
    
    // Log the analysis result
    console.log('Analysis Result:');
    console.log(`Rent Range: $${analysisResult.rentRange.low} - $${analysisResult.rentRange.high} (median: $${analysisResult.rentRange.median})`);
    console.log('Influencing Factors:');
    analysisResult.influencingFactors.forEach(factor => console.log(`- ${factor}`));
    console.log('\nMarket Comparison:');
    console.log(analysisResult.marketComparison);
    console.log('\nRecommendations:');
    analysisResult.recommendations.forEach(rec => console.log(`- ${rec}`));
    
    // Check if we're using real API data or mock data
    const dataSource = analysisResult.dataSource || analysisResult.comparableProperties[0]?.source;
    console.log(`\nData Source: ${dataSource}`);
    
    console.log('\nComparable Properties:');
    analysisResult.comparableProperties.forEach(prop => {
      console.log(`- ${prop.address}: ${prop.beds} bed, ${prop.baths} bath, ${prop.sqft} sqft, $${prop.rent}/month (${prop.source})`);
    });
  } catch (error) {
    console.error('Error parsing output:');
    console.error(error);
    console.log('Raw output:');
    console.log(stdout);
  }
}); 
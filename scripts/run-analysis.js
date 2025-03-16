#!/usr/bin/env node

// Load environment variables
require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });
const { exec } = require('child_process');

// Get the Rentcast API key from environment
const rentcastApiKey = process.env.RENTCAST_API_KEY;

// Function to run the Python script
function runPythonScript(propertyData) {
  // Add the API key to the property data
  const dataWithApiKey = {
    ...propertyData,
    rentcastApiKey
  };

  // Convert the data to a JSON string and escape quotes for the command line
  const escapedData = JSON.stringify(dataWithApiKey).replace(/"/g, '\\"');

  // Run the Python script with the data
  const command = `python3 scripts/rent_analysis_agent.py "${escapedData}"`;
  
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(stdout);
  });
}

// Example property data
const propertyData = {
  propertyType: "apartment",
  beds: 2,
  baths: 1,
  squareFeet: 1000,
  yearBuilt: "2010",
  address: "123 Main St",
  zipCode: "94107",
  amenities: ["Parking", "Dishwasher"]
};

// Run the script
runPythonScript(propertyData); 
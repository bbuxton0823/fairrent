#!/usr/bin/env node

require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });
const https = require('https');
const http = require('http');

// Helper function to make HTTP requests
function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = (options.protocol === 'https:' ? https : http).request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      res.on('end', () => {
        try {
          const jsonData = responseData ? JSON.parse(responseData) : {};
          resolve({ statusCode: res.statusCode, data: jsonData });
        } catch (e) {
          resolve({ statusCode: res.statusCode, data: responseData });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

// Test Google Maps API
async function testGoogleMapsAPI() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return { status: 'error', message: 'API key not found' };
  }

  try {
    const options = {
      hostname: 'maps.googleapis.com',
      port: 443,
      path: `/maps/api/js?key=${apiKey}&libraries=places`,
      method: 'GET',
      protocol: 'https:'
    };

    const response = await makeRequest(options);
    if (response.statusCode === 200) {
      return { status: 'success', message: 'Google Maps API is working' };
    } else {
      return { status: 'error', message: `HTTP error: ${response.statusCode}` };
    }
  } catch (error) {
    return { status: 'error', message: `Exception: ${error.message}` };
  }
}

// Test OpenAI API
async function testOpenAIAPI() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return { status: 'error', message: 'API key not found' };
  }

  try {
    const options = {
      hostname: 'api.openai.com',
      port: 443,
      path: '/v1/chat/completions',
      method: 'POST',
      protocol: 'https:',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    };

    const data = {
      model: process.env.OPENAI_MODEL || 'gpt-4',
      messages: [{ role: 'user', content: 'Hello, this is a test.' }],
      max_tokens: 10
    };

    const response = await makeRequest(options, data);
    if (response.statusCode === 200) {
      return { status: 'success', message: 'OpenAI API is working' };
    } else {
      return { status: 'error', message: `HTTP error: ${response.statusCode}, ${JSON.stringify(response.data)}` };
    }
  } catch (error) {
    return { status: 'error', message: `Exception: ${error.message}` };
  }
}

// Test Rentcast API
async function testRentcastAPI() {
  const apiKey = process.env.RENTCAST_API_KEY;
  if (!apiKey) {
    return { status: 'error', message: 'API key not found' };
  }

  try {
    const options = {
      hostname: 'api.rentcast.io',
      port: 443,
      path: '/v1/properties?address=123+Main+St&zipCode=94107',
      method: 'GET',
      protocol: 'https:',
      headers: {
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json'
      }
    };

    const response = await makeRequest(options);
    if (response.statusCode === 200) {
      return { status: 'success', message: 'Rentcast API is working' };
    } else {
      return { status: 'error', message: `HTTP error: ${response.statusCode}, ${JSON.stringify(response.data)}` };
    }
  } catch (error) {
    return { status: 'error', message: `Exception: ${error.message}` };
  }
}

// Main function
async function main() {
  const results = {
    'Google Maps API': await testGoogleMapsAPI(),
    'OpenAI API': await testOpenAIAPI(),
    'Rentcast API': await testRentcastAPI()
  };

  console.log(JSON.stringify(results, null, 2));

  // Summary
  const workingApis = Object.keys(results).filter(api => results[api].status === 'success');
  const failingApis = Object.keys(results).filter(api => results[api].status === 'error');

  console.log('\nSummary:');
  console.log(`Working APIs (${workingApis.length}): ${workingApis.join(', ')}`);
  console.log(`Failing APIs (${failingApis.length}): ${failingApis.join(', ')}`);

  failingApis.forEach(api => {
    console.log(`\n${api} error: ${results[api].message}`);
  });
}

main().catch(error => {
  console.error('Error running tests:', error);
}); 
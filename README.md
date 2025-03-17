# FairRent

A rental property analysis application that helps users determine fair market rent for their properties using real data from the Rentcast API.

## Version 1.0 Features

- **Real-time Rental Analysis**: Get accurate rent estimates based on real market data from the Rentcast API
- **Comparable Property Search**: Find similar properties based on location, bedrooms, bathrooms, and property type
- **Detailed Rent Insights**: View low, median, and high rent estimates with influencing factors
- **Market Comparison**: See how your property compares to similar properties in the area
- **Listing Recommendations**: Get actionable suggestions to improve your property listing
- **Fallback Mechanism**: Automatically generates mock data if API access fails

## Quick Start

The easiest way to get started is to use our setup script:

```bash
# Clone the repository
git clone https://github.com/bbuxton0823/fairrent.git
cd fairrent

# Run the setup script
chmod +x setup.sh
./setup.sh

# Add your Rentcast API key to .env.local
# RENTCAST_API_KEY=your_api_key_here

# Test the Rentcast API integration
./test-rentcast.sh

# Start the development server
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## Manual Setup

If you prefer to set up manually:

1. **Prerequisites**:
   - Node.js (v16 or higher)
   - Python (v3.8 or higher)
   - npm or yarn

2. **Install JavaScript dependencies**:
   ```bash
   npm install
   ```

3. **Set up Python virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

4. **Configure environment variables**:
   Create a `.env.local` file with:
   ```
   RENTCAST_API_KEY=your_rentcast_api_key
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key  # Optional
   OPENAI_API_KEY=your_openai_api_key  # Optional
   ```

5. **Start the development server**:
   ```bash
   npm run dev
   ```

## Testing the API Integration

To verify that the Rentcast API integration is working:

```bash
./test-rentcast.sh
```

This will run a test script that queries the Rentcast API for comparable properties in San Francisco and displays the results.

## API Usage

### Rent Analysis Endpoint

`POST /api/rent-analysis`

Request body:
```json
{
  "address": "123 Main St",
  "city": "San Francisco",
  "state": "CA",
  "zipCode": "94105",
  "beds": 2,
  "baths": 2,
  "squareFeet": 1200,
  "propertyType": "apartment",
  "yearBuilt": "2010",
  "amenities": ["Parking", "Dishwasher", "Washer/Dryer"]
}
```

See the full API documentation in the [API.md](API.md) file.

## Project Structure

- `/app` - Next.js application code
- `/scripts` - Python scripts for rental analysis
  - `rentcast_agent.py` - Main script for Rentcast API integration
  - `test-venv.js` - Test script for the API integration
- `/public` - Static assets
- `setup.sh` - Setup script for the project
- `test-rentcast.sh` - Script to test the Rentcast API integration

## Getting a Rentcast API Key

To use the real data features, you'll need a Rentcast API key:

1. Sign up at [Rentcast.io](https://rentcast.io/)
2. Navigate to your account settings to get your API key
3. Add the key to your `.env.local` file

## Setting Up Google Maps API Key

The application uses Google Maps API for geocoding addresses. To ensure this functionality works correctly:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Library"
4. Search for and enable the following APIs:
   - Geocoding API
   - Maps JavaScript API
   - Street View API
5. Go to "APIs & Services" > "Credentials"
6. Click "Create Credentials" > "API Key"
7. Copy your new API key
8. Add the key to your `.env.local` file:
   ```
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```
9. For production, restrict the API key to only the APIs you're using and set HTTP referrer restrictions

**Important**: If you see "REQUEST_DENIED" errors in the logs, it means your API key doesn't have the Geocoding API enabled. Make sure to enable all required APIs listed above.

## License

MIT

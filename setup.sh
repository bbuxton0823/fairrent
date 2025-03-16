#!/bin/bash

# Exit on error
set -e

echo "Setting up FairRent development environment..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Python 3 is required but not installed. Please install Python 3 and try again."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is required but not installed. Please install Node.js and try again."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "npm is required but not installed. Please install npm and try again."
    exit 1
fi

# Install JavaScript dependencies
echo "Installing JavaScript dependencies..."
npm install

# Create Python virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment and install Python dependencies
echo "Installing Python dependencies..."
source venv/bin/activate
pip install -r requirements.txt

# Check if .env.local exists, create template if it doesn't
if [ ! -f ".env.local" ]; then
    echo "Creating .env.local template..."
    cat > .env.local << EOL
# API Keys
RENTCAST_API_KEY=your_rentcast_api_key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
OPENAI_API_KEY=your_openai_api_key

# Auth0 Configuration (if needed)
AUTH0_SECRET=your_auth0_secret
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL=your_auth0_issuer_url
AUTH0_CLIENT_ID=your_auth0_client_id
AUTH0_CLIENT_SECRET=your_auth0_client_secret
EOL
    echo "Please edit .env.local and add your API keys."
fi

# Make Python scripts executable
chmod +x scripts/rentcast_agent.py

echo "Setup complete! To start the development server:"
echo "1. Activate the virtual environment: source venv/bin/activate"
echo "2. Run: npm run dev"
echo "3. Open http://localhost:3000 in your browser" 
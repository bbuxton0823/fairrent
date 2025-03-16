#!/usr/bin/env python3
import os
import sys
import json
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
load_dotenv(".env.local")

def test_google_maps_api():
    api_key = os.environ.get("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY")
    if not api_key:
        return {"status": "error", "message": "API key not found"}
    
    url = f"https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key={api_key}"
    try:
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            if data.get("status") == "OK":
                return {"status": "success", "message": "Google Maps API is working"}
            else:
                return {"status": "error", "message": f"API error: {data.get('status')}"}
        else:
            return {"status": "error", "message": f"HTTP error: {response.status_code}"}
    except Exception as e:
        return {"status": "error", "message": f"Exception: {str(e)}"}

def test_rapidapi():
    api_key = os.environ.get("RAPIDAPI_KEY")
    if not api_key:
        return {"status": "error", "message": "API key not found"}
    
    url = "https://rapidapi.p.rapidapi.com/ping"
    headers = {
        "X-RapidAPI-Key": api_key,
        "X-RapidAPI-Host": "rapidapi.p.rapidapi.com"
    }
    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            return {"status": "success", "message": "RapidAPI is working"}
        else:
            return {"status": "error", "message": f"HTTP error: {response.status_code}"}
    except Exception as e:
        return {"status": "error", "message": f"Exception: {str(e)}"}

def test_attom_api():
    api_key = os.environ.get("ATTOM_API_KEY")
    if not api_key:
        return {"status": "error", "message": "API key not found"}
    
    url = "https://api.gateway.attomdata.com/propertyapi/v1.0.0/property/basicprofile"
    headers = {
        "apikey": api_key,
        "accept": "application/json"
    }
    params = {
        "address1": "1600 Amphitheatre Parkway",
        "address2": "Mountain View, CA"
    }
    try:
        response = requests.get(url, headers=headers, params=params)
        if response.status_code == 200:
            return {"status": "success", "message": "ATTOM API is working"}
        else:
            return {"status": "error", "message": f"HTTP error: {response.status_code}"}
    except Exception as e:
        return {"status": "error", "message": f"Exception: {str(e)}"}

def test_openai_api():
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        return {"status": "error", "message": "API key not found"}
    
    url = "https://api.openai.com/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    data = {
        "model": os.environ.get("OPENAI_MODEL", "gpt-4"),
        "messages": [{"role": "user", "content": "Hello, this is a test."}],
        "max_tokens": 10
    }
    try:
        response = requests.post(url, headers=headers, json=data)
        if response.status_code == 200:
            return {"status": "success", "message": "OpenAI API is working"}
        else:
            return {"status": "error", "message": f"HTTP error: {response.status_code}, {response.text}"}
    except Exception as e:
        return {"status": "error", "message": f"Exception: {str(e)}"}

def test_rentcast_api():
    api_key = os.environ.get("RENTCAST_API_KEY")
    if not api_key:
        return {"status": "error", "message": "API key not found"}
    
    url = "https://api.rentcast.io/v1/avm/rent"
    headers = {
        "X-API-KEY": api_key,
        "Content-Type": "application/json"
    }
    params = {
        "address": "123 Main St",
        "zipCode": "94107"
    }
    try:
        response = requests.get(url, headers=headers, params=params)
        if response.status_code == 200:
            return {"status": "success", "message": "Rentcast API is working"}
        else:
            return {"status": "error", "message": f"HTTP error: {response.status_code}, {response.text}"}
    except Exception as e:
        return {"status": "error", "message": f"Exception: {str(e)}"}

def main():
    results = {
        "Google Maps API": test_google_maps_api(),
        "RapidAPI": test_rapidapi(),
        "ATTOM API": test_attom_api(),
        "OpenAI API": test_openai_api(),
        "Rentcast API": test_rentcast_api()
    }
    
    print(json.dumps(results, indent=2))
    
    # Summary
    working_apis = [api for api, result in results.items() if result["status"] == "success"]
    failing_apis = [api for api, result in results.items() if result["status"] == "error"]
    
    print("\nSummary:")
    print(f"Working APIs ({len(working_apis)}): {', '.join(working_apis)}")
    print(f"Failing APIs ({len(failing_apis)}): {', '.join(failing_apis)}")
    
    for api in failing_apis:
        print(f"\n{api} error: {results[api]['message']}")

if __name__ == "__main__":
    main() 
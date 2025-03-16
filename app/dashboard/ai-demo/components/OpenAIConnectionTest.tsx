'use client';

import { useState, useEffect } from 'react';

export default function OpenAIConnectionTest() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testConnection = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/test-openai');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to test OpenAI connection');
      }
      
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-xl font-semibold mb-4">OpenAI Connection Test</h2>
      
      <button
        onClick={testConnection}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Test OpenAI Connection'}
      </button>
      
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <h3 className="text-md font-medium text-red-800">Error</h3>
          <p className="text-sm text-red-600 mt-1">{error}</p>
        </div>
      )}
      
      {result && (
        <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-md">
          <h3 className="text-md font-medium text-gray-800">
            {result.success ? '✅ Connection Successful' : '❌ Connection Failed'}
          </h3>
          
          <div className="mt-2 space-y-2 text-sm">
            {result.message && (
              <p><span className="font-medium">Response:</span> {result.message}</p>
            )}
            
            <p><span className="font-medium">API Key:</span> {result.keyExists ? 'Found' : 'Not found'}</p>
            
            {result.keyFirstChars && (
              <p><span className="font-medium">API Key starts with:</span> {result.keyFirstChars}</p>
            )}
            
            {result.model && (
              <p><span className="font-medium">Model:</span> {result.model}</p>
            )}
            
            {result.usage && (
              <p><span className="font-medium">Token usage:</span> {result.usage.total_tokens} tokens</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 
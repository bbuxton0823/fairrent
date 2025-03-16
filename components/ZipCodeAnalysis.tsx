'use client';

import { useState } from 'react';

interface ZipCodeAnalysisProps {
  data: string;
  onUpdate: (data: string) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export default function ZipCodeAnalysis({
  data,
  onUpdate,
  onNext,
  onPrevious,
}: ZipCodeAnalysisProps) {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeLocation = async () => {
    if (!data || data.length !== 5) {
      setError('Please enter a valid 5-digit ZIP code');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/neighborhood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ zipCode: data })
      });

      if (!response.ok) throw new Error('Failed to analyze location');

      const result = await response.json();
      setAnalysis(result);
    } catch (err) {
      setError('Failed to analyze location. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black rounded-lg p-6">
      <h2 className="text-xl font-bold text-white mb-6">Location Analysis</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-white mb-2">
            ZIP Code<span className="text-red-500">*</span>
          </label>
          <div className="flex gap-4">
            <input
              type="text"
              value={data}
              onChange={(e) => onUpdate(e.target.value)}
              placeholder="Enter ZIP code"
              className="flex-1 bg-gray-800/50 text-white rounded-md p-2 border border-gray-700"
              pattern="[0-9]{5}"
              maxLength={5}
              required
            />
            <button
              onClick={analyzeLocation}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Analyzing...' : 'Analyze Location'}
            </button>
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>

        {loading && (
          <div className="text-center text-gray-400 py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p>Analyzing neighborhood data...</p>
          </div>
        )}

        {analysis && !loading && (
          <div className="space-y-6">
            <div className="bg-gray-800/50 p-6 rounded-lg">
              <div className="flex items-center justify-center gap-8">
                <div className="relative w-40 h-40">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      fill="none"
                      stroke="#1f2937"
                      strokeWidth="8"
                      className="opacity-25"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${(analysis.score / 10) * 439.6} 439.6`}
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                    <div className="text-4xl font-bold text-blue-500">{analysis.score.toFixed(1)}</div>
                    <div className="text-sm text-gray-400">out of 10</div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl font-semibold text-white">Neighborhood Score</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-sm">
                      <div className="text-gray-400">Housing</div>
                      <div className="text-white font-medium">{(analysis.categoryBreakdown.housing.weightedScore * 10).toFixed(1)}/3.5</div>
                    </div>
                    <div className="text-sm">
                      <div className="text-gray-400">Crime</div>
                      <div className="text-white font-medium">{(analysis.categoryBreakdown.crime.weightedScore * 10).toFixed(1)}/3.0</div>
                    </div>
                    <div className="text-sm">
                      <div className="text-gray-400">Economic</div>
                      <div className="text-white font-medium">{(analysis.categoryBreakdown.economicEducation.weightedScore * 10).toFixed(1)}/2.0</div>
                    </div>
                    <div className="text-sm">
                      <div className="text-gray-400">Services</div>
                      <div className="text-white font-medium">{(analysis.categoryBreakdown.services.weightedScore * 10).toFixed(1)}/1.0</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <button
          onClick={onPrevious}
          className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
        >
          Previous
        </button>
        <button
          onClick={onNext}
          disabled={!analysis}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
} 
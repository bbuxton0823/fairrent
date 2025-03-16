'use client';

import { useState } from 'react';

interface LocationAnalysisProps {
  data: string;
  onUpdate: (data: string) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export default function LocationAnalysis({
  data,
  onUpdate,
  onNext,
  onPrevious,
}: LocationAnalysisProps) {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate(e.target.value);
    setAnalysis(null);
    setError(null);
  };

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
              maxLength={5}
              pattern="[0-9]*"
              className="flex-1 bg-gray-800/50 text-white rounded-md p-2 border border-gray-700"
              value={data}
              onChange={handleZipCodeChange}
              placeholder="Enter ZIP code"
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

            {analysis.historicalTrends && analysis.historicalTrends.length > 0 && (
              <div className="bg-gray-800/50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-white mb-4">Historical Trends</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>Date</span>
                    <span>Score</span>
                  </div>
                  {analysis.historicalTrends.map((trend: any) => (
                    <div key={trend.analysisDate} className="flex items-center justify-between">
                      <span className="text-gray-300">
                        {new Date(trend.analysisDate).toLocaleDateString()}
                      </span>
                      <span className="text-blue-500 font-semibold">
                        {trend.finalScore.toFixed(2)}
                      </span>
                    </div>
                  ))}
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="text-sm text-gray-400 mb-2">Score Trend</div>
                    <div className="h-24 relative">
                      {analysis.historicalTrends.map((trend: any, index: number) => {
                        const x = (index / (analysis.historicalTrends.length - 1)) * 100;
                        const y = ((10 - trend.finalScore) / 10) * 100;
                        return (
                          <div
                            key={trend.analysisDate}
                            className="absolute w-2 h-2 bg-blue-500 rounded-full transform -translate-x-1 -translate-y-1"
                            style={{
                              left: `${x}%`,
                              top: `${y}%`
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-lg font-semibold text-white">Housing</h4>
                  <span className="text-sm text-gray-400">35%</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Median Rent:</span>
                    <span className="text-white">${analysis.categoryBreakdown.housing.details.medianRent.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Median Home Value:</span>
                    <span className="text-white">${analysis.categoryBreakdown.housing.details.medianHomeValue.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-lg font-semibold text-white">Crime</h4>
                  <span className="text-sm text-gray-400">30%</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Crime Rate:</span>
                    <span className="text-white">{analysis.categoryBreakdown.crime.details.crimeRate} per 1,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Incidents:</span>
                    <span className="text-white">{analysis.categoryBreakdown.crime.details.totalIncidents}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-lg font-semibold text-white">Economic & Education</h4>
                  <span className="text-sm text-gray-400">20%</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Median Income:</span>
                    <span className="text-white">${analysis.categoryBreakdown.economicEducation.details.medianIncome.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Education Level:</span>
                    <span className="text-white">{(analysis.categoryBreakdown.economicEducation.details.educationIndex * 10).toFixed(1)}/10</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-lg font-semibold text-white">Services</h4>
                  <span className="text-sm text-gray-400">10%</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Business Density:</span>
                    <span className="text-white">{analysis.categoryBreakdown.services.details.businessDensity} per sq mile</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-lg font-semibold text-white">Demographics</h4>
                  <span className="text-sm text-gray-400">5%</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Population:</span>
                    <span className="text-white">{analysis.categoryBreakdown.demographics.details.totalPopulation.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Diversity Index:</span>
                    <span className="text-white">{(analysis.categoryBreakdown.demographics.details.diversityIndex * 10).toFixed(1)}/10</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

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
    </div>
  );
} 
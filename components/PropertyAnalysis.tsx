'use client';

interface AnalysisData {
  // Add specific properties as needed
  [key: string]: unknown;
}

interface PropertyAnalysisProps {
  data: AnalysisData;
  onUpdate: (data: AnalysisData) => void;
  onPrevious: () => void;
}

export default function PropertyAnalysis({
  data,
  onUpdate,
  onPrevious,
}: PropertyAnalysisProps) {
  return (
    <div className="bg-black rounded-lg p-6">
      <h2 className="text-xl font-bold text-white mb-6">Property Analysis</h2>
      
      {/* This will be expanded with the full report */}
      <div className="space-y-6">
        {/* Placeholder for the analysis content */}
        <p className="text-white">Analysis content will go here</p>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <button
          onClick={onPrevious}
          className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
        >
          Previous
        </button>
      </div>
    </div>
  );
} 
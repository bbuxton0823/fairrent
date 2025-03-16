'use client';

interface LocationData {
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

interface LocationDetailsProps {
  data: LocationData;
  onUpdate: (data: LocationData) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export default function LocationDetails({
  data,
  onUpdate,
  onNext,
  onPrevious,
}: LocationDetailsProps) {
  return (
    <div className="bg-black rounded-lg p-6">
      <h2 className="text-xl font-bold text-white mb-4">Location Details</h2>
      
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-gray-200 mb-2">Street Address</label>
          <input
            type="text"
            className="w-full bg-gray-800 text-white rounded-md p-2"
            value={data.address || ''}
            onChange={(e) => onUpdate({ ...data, address: e.target.value })}
          />
        </div>
        
        <div>
          <label className="block text-gray-200 mb-2">City</label>
          <input
            type="text"
            className="w-full bg-gray-800 text-white rounded-md p-2"
            value={data.city || ''}
            onChange={(e) => onUpdate({ ...data, city: e.target.value })}
          />
        </div>
        
        <div>
          <label className="block text-gray-200 mb-2">State</label>
          <input
            type="text"
            className="w-full bg-gray-800 text-white rounded-md p-2"
            value={data.state || ''}
            onChange={(e) => onUpdate({ ...data, state: e.target.value })}
          />
        </div>
        
        <div>
          <label className="block text-gray-200 mb-2">Zip Code</label>
          <input
            type="text"
            className="w-full bg-gray-800 text-white rounded-md p-2"
            value={data.zipCode || ''}
            onChange={(e) => onUpdate({ ...data, zipCode: e.target.value })}
          />
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={onPrevious}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          Previous
        </button>
        <button
          onClick={onNext}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Next
        </button>
      </div>
    </div>
  );
} 
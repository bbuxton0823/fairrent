import React from 'react';

const PropertySummaryHeader = () => {
  // Dummy data; replace with real property details
  const property = {
    address: '123 Main St.',
    type: 'Apartment',
    size: '1200 sqft'
  };

  return (
    <div className="bg-gray-50 py-6 px-4 mb-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Property Summary</h1>
        <div className="bg-white shadow rounded-lg p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h2 className="text-lg font-semibold">Address</h2>
            <p>{property.address}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Property Type</h2>
            <p>{property.type}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Size</h2>
            <p>{property.size}</p>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white shadow rounded-lg p-4 text-center">
            <h3 className="font-medium text-gray-700">Real-Time Data</h3>
            <p className="text-sm text-gray-500">Updated continuously from 300+ sources</p>
          </div>
          <div className="bg-white shadow rounded-lg p-4 text-center">
            <h3 className="font-medium text-gray-700">HUD-Compliant Reports</h3>
            <p className="text-sm text-gray-500">Audit-Proven and compliant with HUD</p>
          </div>
          <div className="bg-white shadow rounded-lg p-4 text-center">
            <h3 className="font-medium text-gray-700">Rapid Generation</h3>
            <p className="text-sm text-gray-500">Generate reports in seconds</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertySummaryHeader; 
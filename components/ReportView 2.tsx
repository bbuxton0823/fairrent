'use client';

interface ReportViewProps {
  report: any; // Replace with proper type from Prisma
}

export default function ReportView({ report }: ReportViewProps) {
  return (
    <div className="bg-black rounded-lg p-6">
      <h2 className="text-xl font-bold text-white mb-4">Property Report</h2>
      
      {/* Property Details */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-2">Property Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-400 text-sm">Address</label>
            <p className="text-white">{report.address}</p>
          </div>
          <div>
            <label className="block text-gray-400 text-sm">Property Type</label>
            <p className="text-white">{report.propertyType}</p>
          </div>
          <div>
            <label className="block text-gray-400 text-sm">Bedrooms</label>
            <p className="text-white">{report.beds}</p>
          </div>
          <div>
            <label className="block text-gray-400 text-sm">Bathrooms</label>
            <p className="text-white">{report.baths}</p>
          </div>
        </div>
      </div>

      {/* Analysis Results */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">Analysis Results</h3>
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 text-sm">Requested Rent</label>
              <p className="text-white">${report.requestedRent}</p>
            </div>
            <div>
              <label className="block text-gray-400 text-sm">Market Rent</label>
              <p className="text-white">${report.marketRent}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
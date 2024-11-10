import React, { useState } from 'react';

const ReportGenerator = () => {
  // State for report type and format
  const [reportType, setReportType] = useState('volunteer-history');
  const [format, setFormat] = useState('pdf');

  // Handle form submission to download the report
  const handleDownload = () => {
    const url = `http://localhost:5000/api/reports/generate-${format}/${reportType}`;
    window.open(url, '_blank');
  };

  return (
    <div className="flex items-center justify-center p-10 bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Report Generator</h2>

        {/* Report Type Selection */}
        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-700 mb-2">Select Report Type:</label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="volunteer-history">Volunteer History</option>
            <option value="event-assignments">Event Assignments</option>
          </select>
        </div>

        {/* Format Selection */}
        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-700 mb-2">Select Format:</label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="pdf">PDF</option>
            <option value="csv">CSV</option>
          </select>
        </div>

        {/* Download Button */}
        <button
          onClick={handleDownload}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Download Report
        </button>
      </div>
    </div>
  );
};

export default ReportGenerator;
import React, { useState } from 'react';
import { ReactElement } from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
const History = () => {
  // Sample data for the volunteer history
  const [volunteerHistory, setVolunteerHistory] = useState([
    { id: 1, event: 'Beach Cleanup', date: '2024-05-15', status: 'Completed' },
    { id: 2, event: 'Tree Planting', date: '2024-06-22', status: 'Pending' },
    { id: 3, event: 'Community Kitchen', date: '2024-07-10', status: 'Completed' },
    { id: 4, event: 'Fundraiser Gala', date: '2024-08-01', status: 'Cancelled' },
  ]);

  return (
    <div className="p-4 max-w-4xl mx-auto bg-white shadow-md rounded-lg">
      <Header />
      <h1 className="text-xl font-bold mb-4">Volunteer History</h1>
      <table className="w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2 text-left">Event</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {volunteerHistory.length === 0 ? (
            <tr>
              <td colSpan={3} className="border border-gray-300 px-4 py-2 text-center text-gray-500">
                No history available
              </td>
            </tr>
          ) : (
            volunteerHistory.map((entry) => (
              <tr key={entry.id}>
                <td className="border border-gray-300 px-4 py-2">{entry.event}</td>
                <td className="border border-gray-300 px-4 py-2">{entry.date}</td>
                <td className="border border-gray-300 px-4 py-2">{entry.status}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <Footer />
    </div>
  );
};

export default History;

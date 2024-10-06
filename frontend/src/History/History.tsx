import React, { useState, useEffect } from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';

interface HistoryEntry {
  id: number;
  event: string;
  date: string;
  status: string;
}

const History = () => {
  const [volunteerHistory, setVolunteerHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch volunteer history from backend
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/history');
        if (!response.ok) {
          throw new Error('Failed to fetch history');
        }
        const data = await response.json();
        setVolunteerHistory(data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="p-4 max-w-4xl mx-auto bg-white shadow-md rounded-lg">
      <Header />
      <h1 className="text-xl font-bold mb-4">Volunteer History</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
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
      )}
      <Footer />
    </div>
  );
};

export default History;

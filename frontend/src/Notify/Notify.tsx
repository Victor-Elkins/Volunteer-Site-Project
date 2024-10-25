import React, { useState, useEffect } from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';

interface NotificationEntry {
  id: number;
  event: string;  // Keeping this as event since it represents events in the notifications
  date: string;
}

const Notify: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationEntry[]>([]); // Updated state name
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch notifications from the backend
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/notifications", { // Updated endpoint
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Failed to fetch notifications'); // Updated error message
        }
        const data = await response.json();
        setNotifications(data); // Updated state setter
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

    fetchNotifications();
  }, []);

  return (
    <div className="p-4 max-w-4xl mx-auto bg-white shadow-md rounded-lg">
      <Header />
      <h1 className="text-xl font-bold mb-4">Notifications</h1> {/* Updated title */}
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
            </tr>
          </thead>
          <tbody>
            {notifications.length === 0 ? ( // Updated to check notifications
              <tr>
                <td colSpan={2} className="border border-gray-300 px-4 py-2 text-center text-gray-500">
                  No notifications available
                </td>
              </tr>
            ) : (
              notifications.map((entry) => (
                <tr key={entry.id}>
                  <td className="border border-gray-300 px-4 py-2">{entry.event}</td>
                  <td className="border border-gray-300 px-4 py-2">{entry.date}</td>
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

export default Notify;

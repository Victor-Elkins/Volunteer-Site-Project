import React, { useState, useEffect } from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';

// Define the structure of a Notification
interface Notification {
  id: number;
  message: string;
}

const Notify: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch notifications from the backend
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/notifications');
        if (!response.ok) {
          throw new Error('Failed to fetch notifications');
        }
        const data = await response.json();
        setNotifications(data);
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Remove a notification by ID
  const removeNotification = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:5000/api/notifications/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to remove notification');
      }
      setNotifications(notifications.filter(notification => notification.id !== id));
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred while removing the notification');
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto bg-white shadow-md rounded-lg">
      <Header />
      <h1 className="text-xl font-bold mb-4">Notifications</h1>

      {loading ? (
        <p className="text-gray-500">Loading notifications...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : notifications.length === 0 ? (
        <p className="text-gray-500">No notifications</p>
      ) : (
        <ul className="space-y-2">
          {notifications.map(notification => (
            <li key={notification.id} className="flex justify-between items-center p-2 border-b border-gray-200">
              <span>{notification.message}</span>
              <button 
                className="text-red-500 hover:text-red-700" 
                onClick={() => removeNotification(notification.id)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      <Footer />
    </div>
  );
};

export default Notify;

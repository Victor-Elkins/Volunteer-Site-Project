import React, { useState, useEffect } from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';

// Define the structure of a Notification
interface Notification {
  id: number;
  message: string;
}

interface NotifyProps {
  notifications: Notification[];
  removeNotification: (id: number) => void;
}

const Notify: React.FC<NotifyProps> = ({ notifications, removeNotification }) => {
  return (
    <div className="p-4 max-w-lg mx-auto bg-white shadow-md rounded-lg">
      <Header />
      <h1 className="text-xl font-bold mb-4">Notifications</h1>
      <ul className="space-y-2">
        {notifications.length === 0 ? (
          <li className="text-gray-500">No notifications</li>
        ) : (
          notifications.map(notification => (
            <li key={notification.id} className="flex justify-between items-center p-2 border-b border-gray-200">
              <span>{notification.message}</span>
              <button 
                className="text-red-500 hover:text-red-700" 
                onClick={() => removeNotification(notification.id)}
              >
                Remove
              </button>
            </li>
          ))
        )}
      </ul>
      <Footer />
    </div>
  );
};

export default Notify;

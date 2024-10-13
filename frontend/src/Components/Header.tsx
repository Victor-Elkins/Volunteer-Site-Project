import React, { useState, useEffect } from 'react';
import { FaBell, FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/notifications');
        if (!response.ok) {
          throw new Error('Failed to fetch notifications');
        }
        const data = await response.json();
        setNotificationCount(data.length);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };
    fetchNotifications();
  }, []);
  
  
  

  const handleBellClick = () => {
    navigate('/notify');
  };

  const handleHistoryClick = () => {
    navigate('/history');
  };

  const handleHomeClick = () => {
    navigate('/home');
  };

  const handleProfileClick = () => {
    navigate('/profileedit');
  }

  const handleEventManagementClick = () => {
    navigate('/Event-Managing-Form');
  }

  const handleVolunteerMatchingClick = () => {
    navigate('/Volunteer-Matching-Form');
  }

  return (
    <nav className="bg-gray-800 w-full fixed top-0 left-0 z-10">
      <div className="flex justify-between items-center px-4 py-2 max-w-full mx-auto">
        <div className="text-white text-lg font-bold">
          Volunteer Events
        </div>
        <ul className="flex ml-auto space-x-6">
          <li>
            <a className="text-blue-300 hover:text-white" onClick={handleHomeClick} href="#">Home</a>
          </li>
          <li>
            <a className="text-blue-300 hover:text-white" onClick={handleHistoryClick} href="#">History</a>
          </li>
          <li>
            <a className="text-blue-300 hover:text-white" onClick={handleEventManagementClick} href="#">Event-Management</a>
          </li>
          <li>
            <a className="text-blue-300 hover:text-white" onClick={handleVolunteerMatchingClick} href="#">Volunteer-Matching</a>
          </li>
        </ul>
        <div className="flex items-center space-x-4 ml-4">
          <button
            className="text-white hover:text-gray-400 relative"
            onClick={handleBellClick}
          >
            <FaBell size={24} />
            {notificationCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </button>
          <button className="text-white hover:text-gray-400" onClick={handleProfileClick}>
            <FaUserCircle size={24} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Header;
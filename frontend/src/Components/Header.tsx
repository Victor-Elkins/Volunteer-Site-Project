// src/components/Header.js
import React from 'react';
import { FaBell, FaUserCircle } from 'react-icons/fa'; // Import React Icons
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Header = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleBellClick = () => {
    navigate('/notify'); // Navigate to the Notify route
  };

  const handleHistoryClick = () => {
    navigate('/history');
  };

  const handleHomeClick = () => {
    navigate('/home');
  };

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
            <a className="text-blue-300 hover:text-white" href="#">Events</a>
          </li>
          <li>
            <a className="text-blue-300 hover:text-white" href="#">Contact</a>
          </li>
        </ul>
        <div className="flex items-center space-x-4 ml-4">
          <button 
            className="text-white hover:text-gray-400"
            onClick={handleBellClick}
          >
            <FaBell size={24} />
          </button>
          <button className="text-white hover:text-gray-400">
            <FaUserCircle size={24} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Header;

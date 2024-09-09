import React from 'react';
import { FaBell } from 'react-icons/fa'; // Importing bell icon from react-icons

const Home = () => {
  return (
    <div className="bg-gray-200 min-h-screen">
      {/* Navigation Bar */}
      <nav className="bg-maroon-600 text-white p-4">
        <ul className="flex justify-around items-center">
          <li className="hover:text-gray-300 transition duration-300">
            <a href="/">Home</a>
          </li>
          <li className="hover:text-gray-300 transition duration-300 flex items-center">
            <a href="/notifications" className="mr-2">Notifications</a>
            <FaBell /> {/* Bell Icon */}
          </li>
          <li className="hover:text-gray-300 transition duration-300">
            <a href="/history">History</a>
          </li>
          <li className="hover:text-gray-300 transition duration-300">
            <a href="/events">Events</a>
          </li>
          <li className="hover:text-gray-300 transition duration-300">
            <a href="/profile">Profile</a>
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to the Home Page</h1>
          <p className="text-lg text-gray-600 mb-6">This is a simple page built with Tailwind CSS</p>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;

import React from 'react';
import '../index.css'; // Main CSS
import './Home.css'; // Home-specific CSS (if any)
import Header from '../Components/Header';
import Footer from '../Components/Footer';
const Home = () => {
  return (
    
    <div className="p-4 max-w-lg mx-auto bg-white shadow-md rounded-lg">
      <Header />
      <h1 className="text-xl font-bold mb-4">Welcome to Volunteer Events</h1>
      <p>Here you can find and manage your volunteer events.</p>
      <Footer />
    </div>
    
  );
};

export default Home;

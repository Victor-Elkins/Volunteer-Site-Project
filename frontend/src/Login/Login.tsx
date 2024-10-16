import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Footer from '../Components/Footer';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  // State for username, password, and showPassword
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(''); // State for error messages

  // useNavigate hook for redirecting
  const navigate = useNavigate();

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }), // Send the credentials as JSON
      credentials: 'include',
  });

  // Check if the response status is not ok (e.g., 400 or 401)
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Login failed');
  }

  navigate('/home');
  } catch (err) {
    if (err instanceof Error) {
      setError(err.message);
    } else {
      setError('An unexpected error occurred');
    }
  }
};

  return (
    <div className="flex items-center justify-center mt-10">
      <form 
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Welcome</h2>

        {/* Error Message */}
        {error && (
          <div className="mb-4 text-red-500 text-center">
            {error}
          </div>
        )}

        {/* Username Field */}
        <div className="mb-1">
          <label className="block mb-2 text-sm font-bold text-gray-700 text-left">
            Username
          </label>
          <input 
            id="username"
            type="text"
            className="w-full px-3 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Update username state
            required
          />
          <div className="flex justify-end pt-1">
            <a href="#" className="text-sm hover:underline">Forgot Username?</a>
          </div>
        </div>

        {/* Password Field */}
        <div className="mb-4 relative">
          <label className="block mb-2 text-sm font-bold text-gray-700 text-left">
            Password
          </label>
          <input 
            id="password"
            type={showPassword ? 'text' : 'password'}  // Dynamically change input type
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Update password state
            required
          />
          <div 
            className="absolute inset-y-0 right-0 pr-3 pt-2 flex items-center cursor-pointer"
            onClick={togglePasswordVisibility}  // Click to toggle visibility
          >
            {showPassword ? <FaEyeSlash className="text-gray-500" /> : <FaEye className="text-gray-500" />} 
          </div>
          <div className="flex justify-end pt-1">
            <a href="#" className="text-sm hover:underline">Forgot Password?</a>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Login
        </button>

        {/* Create an Account */}
        <div className="md-4 text-center pt-4">
          <p className="text-sm text-gray-600">
            Don't have a Volunteer account?
          </p>
          <p className="text-blue-500 font-medium hover:underline hover:text-blue-600">
            <a href="../Registration">Create an account</a>
          </p>
        </div>
      </form>
      <Footer />
    </div>
  )
}

export default Login;

import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Footer from '../Components/Footer';
import { useNavigate } from 'react-router-dom';

const Registration = () => {
  // State to handle username and password
  const [username, setUsername] = useState('');
  const [isUsernameValid, setIsUsernameValid] = useState(true);  // Track username validity
  const [password, setPassword] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(true);  // Track password validity
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // useNavigate hook for redirection
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUsername = e.target.value;
    setUsername(newUsername);

    // Regular expression to validate email format
    const usernameRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Check if the username (email) is valid
    setIsUsernameValid(usernameRegex.test(newUsername));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    // Regular expression to validate password
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
    
    // Check if the password is valid
    setIsPasswordValid(passwordRegex.test(newPassword));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,  // Send the username (email)
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000); // Redirect to login after 2 seconds
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
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Registration</h2>

        {/* Success Message */}
        {success && (
          <div className="mb-4 text-green-500 text-center">
            {success}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 text-red-500 text-center">
            {error}
          </div>
        )}

        {/* Username Field */}
        <div className="mb-4">
          <label className="block mb-2 text-sm font-bold text-gray-700 text-left">
            Username (Email address)
          </label>
          <input 
            id="username"
            type="email"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isUsernameValid ? 'border-gray-300' : 'border-red-500'}`}
            placeholder="example@email.com"
            value={username}
            onChange={handleUsernameChange}
            required
          />
        </div>
        
        {/* Password Field */}
        <div className="relative mb-4">
          <label className="block mb-2 text-sm font-bold text-gray-700 text-left">
            Create a password
          </label>
          <p className="text-sm text-gray-500 text-left mb-3">
            Passwords should be at least 8 characters long and should contain a mixture of uppercase/lowercase letters, numbers, and other characters.
          </p>
          <input 
            id="password"
            type={showPassword ? 'text' : 'password'}  // Dynamically change input type
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isPasswordValid ? 'border-gray-300' : 'border-red-500'}`}
            placeholder="Enter your password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
          <div 
            className="absolute inset-y-0 right-0 pr-3 pt-20 flex items-center cursor-pointer"
            onClick={togglePasswordVisibility}  // Click to toggle visibility
          >
            {showPassword ? <FaEyeSlash className="text-gray-500" /> : <FaEye className="text-gray-500" />} 
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-between pt-2">
          <a href="../Login" className="pl-2 pt-1 text-blue-500 font-medium hover:underline hover:text-blue-600">Back</a>
          <button
            type="submit"
            className={`w-52 ${!isPasswordValid || !isUsernameValid ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'} font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
            disabled={!isPasswordValid || !isUsernameValid}  // Disable if either username or password is invalid
          >
            Register
          </button>
        </div>
      </form>
      <Footer />
    </div>
  )
}

export default Registration;

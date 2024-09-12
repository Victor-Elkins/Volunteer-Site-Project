import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
  // State to toggle password visibility
  const [showPassword, setShowPassword] = useState(false);

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex items-center justify-center mt-10">
      <form className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Welcome</h2>

        {/* Username Field */}
        <div className="mb-1">
          <label className="block mb-2 text-sm font-bold text-gray-700 text-left">
            Username
          </label>
          <input 
            id="username"
            type="text"
            className="w-full px-3 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your username"
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
            <a href="#">Create an account</a>
          </p>
        </div>
      </form>
    </div>
  )
}

export default Login;

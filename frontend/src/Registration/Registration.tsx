import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Registration = () => {
  // State to handle email and password
  const [email, setEmail] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(true);  // Track email validity
  const [password, setPassword] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(true);  // Track password validity
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);

    // Regular expression to validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Check if the email is valid
    setIsEmailValid(emailRegex.test(newEmail));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    // Regular expression to validate password
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
    
    // Check if the password is valid
    setIsPasswordValid(passwordRegex.test(newPassword));
  };

  return (
    <div className="flex items-center justify-center mt-10">
      <form className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Registration</h2>

        {/* Name Field */}
        <div className="mb-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* First Name */}
            <div className="flex-1">
              <label className="block mb-2 text-sm font-bold text-gray-700 text-left">
                First name
              </label>
              <input 
                id="first-name"
                type="text"
                className="w-full px-3 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            {/* Last Name */}
            <div className="flex-1">
              <label className="block mb-2 text-sm font-bold text-gray-700 text-left">
                Last name
              </label>
              <input 
                id="last-name"
                type="text"
                className="w-full px-3 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>
        </div>

        {/* Email Field */}
        <div className="mb-4">
          <label className="block mb-2 text-sm font-bold text-gray-700 text-left">
            Email address
          </label>
          <input 
            id="first-name"
            type="email"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isEmailValid ? 'border-gray-300' : 'border-red-500'}`}
            placeholder="example@email.com"
            value={email}
            onChange={handleEmailChange}
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
          <a href="#" className="pl-2 pt-1 text-blue-500 font-medium hover:underline hover:text-blue-600">Back</a>
          <button
            type="submit"
            className={`w-52 ${!isPasswordValid || !isEmailValid ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'} font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
            disabled={!isPasswordValid || !isEmailValid}  // Disable if either email or password is invalid
          >
            Register
          </button>
        </div>
      </form>
    </div>
  )
}

export default Registration
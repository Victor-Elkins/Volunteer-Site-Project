/*
TODO:
  - Make the state dropdown required and send input to backend
  - Make the skills dropdown required and send input to backend
  - Make date picker required and send input to backend
  - Preferrably implement dropdowns into this file instead of seperate files? (StateDropdown.tsx, Dropdown.tsx)
*/

import React, { useState } from "react";
import Header from "../Components/Header";
import Dropdown from "./Dropdown";
import { StateDropdown } from "./StateDropdown";
import MultipleDatePicker from "../Components/DatePicker";

export default function ProfileEdit() {
  const [fullName, setFullName] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [skills, setSkills] = useState([]);
  const [preferences, setPreferences] = useState("");
  const [availability, setAvailability] = useState([]);

  // Form submission handler
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Prepare the form data
    const userProfileData = {
      fullName,
      streetAddress,
      city,
      state,
      postalCode,
      skills,
      preferences,
      availability,
    };

    try {
      // Send a POST request to the backend
      const response = await fetch("http://localhost:5000/api/userProfile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userProfileData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit data");
      }

      // Handle successful form submission
      const result = await response.json();
      console.log("Profile saved:", result);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-12">
        <Header />
        {/* Personal Info Section */}
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">Personal Information</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Fill in your personal information so we can find events near you.
          </p>
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="col-span-full">
              <label htmlFor="full-name" className="block text-sm font-medium leading-6 text-gray-900">
                Full name <span className="text-red-500">*</span>
              </label>
              <div className="mt-2 flex justify-center">
                <input
                  id="full-name"
                  name="full-name"
                  type="text"
                  autoComplete="name"
                  maxLength={50}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="block w-1/3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="street-address" className="block text-sm font-medium leading-6 text-gray-900">
                Street address <span className="text-red-500">*</span>
              </label>
              <div className="mt-2">
                <input
                  id="street-address"
                  name="street-address"
                  type="text"
                  autoComplete="street-address"
                  maxLength={100}
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-2 sm:col-start-1">
              <label htmlFor="city" className="block text-sm font-medium leading-6 text-gray-900">
                City <span className="text-red-500">*</span>
              </label>
              <div className="mt-2">
                <input
                  id="city"
                  name="city"
                  type="text"
                  autoComplete="address-level2"
                  maxLength={100}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="state" className="block text-sm font-medium leading-6 text-gray-900">
                State / Province <span className="text-red-500">*</span>
              </label>
              <div className="mt-2">
                <StateDropdown />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="postal-code" className="block text-sm font-medium leading-6 text-gray-900">
                ZIP / Postal code <span className="text-red-500">*</span>
              </label>
              <div className="mt-2">
                <input
                  id="postal-code"
                  name="postal-code"
                  type="text"
                  autoComplete="postal-code"
                  maxLength={9}
                  minLength={5}
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">Skills & Preferences</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600 mb-10">
            Pick your skills and preferences so we can match you with the right events.
          </p>

          <Dropdown />

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="col-span-full mb-8">
              <label htmlFor="preferences" className="block text-sm font-medium leading-6 text-gray-900">
                Preferences
              </label>
              <div className="mt-2">
                <textarea
                  id="preferences"
                  name="preferences"
                  rows={4}
                  value={preferences}
                  onChange={(e) => setPreferences(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Optional"
                />
              </div>
            </div>
          </div>
          <MultipleDatePicker />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button type="button" className="text-sm font-semibold leading-6 text-gray-900">
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Save
        </button>
      </div>
    </form>
  )
}

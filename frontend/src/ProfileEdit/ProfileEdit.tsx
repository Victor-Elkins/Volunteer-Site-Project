import React, {useEffect, useState} from "react";
import Header from "../Components/Header";
import Dropdown from "../Components/Dropdown";
import StateDropdown from "../Components/StateDropdown";
import MultipleDatePicker from "../Components/DatePicker";
import type { State } from '../Components/StateDropdown';
import type { Skill } from '../Components/Dropdown';

export default function ProfileEdit() {
    const [errors, setErrors] = useState<string[]>([]);
    const [fullName, setFullName] = useState("");
    const [streetAddress, setStreetAddress] = useState("");
    const [streetAddress2, setStreetAddress2] = useState("");
    const [city, setCity] = useState("");
    const [selectedState, setSelectedState] = useState<State | null>(null);
    const [postalCode, setPostalCode] = useState("");
    const [preferences, setPreferences] = useState("");
    const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);
    const [availability, setAvailability] = useState<Date[]>([]);
    const [successMessageVisible, setSuccessMessageVisible] = useState(false);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/userProfile", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: 'include',
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    console.log(data[0].fullName)

                    // Populate form fields with user profile data
                    setFullName(data[0].fullName || "");
                    setStreetAddress(data[0].streetAddress || "");
                    setStreetAddress2(data[0].streetAddress2 || "");
                    setCity(data[0].city || "");
                    setSelectedState(data[0].state ? { name: data[0].state, code: data[0].state } : null);
                    setPostalCode(data[0].postalCode || "");
                    setPreferences(data[0].preferences || "");
                    setSelectedSkills((data[0].skills && Array.isArray(data[0].skills)) ? data[0].skills.map((skill: string) => ({ name: skill })) : []);
                    setAvailability(data[0].availability && Array.isArray(data[0].availability)
                        ? data[0].availability.map((dateString: string | number | Date) => new Date(dateString))
                        : []);
                } else {
                    console.error("Failed to fetch user profile.");
                }
            } catch (error) {
                console.error("Error fetching user profile:", error);
            }
        };

        fetchUserProfile();
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            (e.target as HTMLInputElement).form?.requestSubmit();
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!selectedState) {
            alert('Please select a state');
            return;
        }
        if (selectedSkills.length === 0) {
            alert('Please selected at least one skill.');
            return;
        }
        if (availability.length === 0) {
            alert('Please select a date.');
            return;
        }
        if (!fullName || !streetAddress || !city || !postalCode) {
            alert('Please fill out all required fields.');
            return;
        }


        const userProfileData = {
            fullName,
            streetAddress,
            streetAddress2,
            city,
            state: selectedState.code,
            postalCode,
            skills: selectedSkills.map(skill => skill.name),
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
                credentials: 'include',
                body: JSON.stringify(userProfileData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(JSON.stringify(errorData.errors));
            }

            // Handle successful form submission
            const result = await response.json();
            console.log("Profile saved:", result);
            setErrors([]);
            setSuccessMessageVisible(true);

            setFullName("");
            setStreetAddress("");
            setStreetAddress2("");
            setCity("");
            setSelectedState(null);
            setPostalCode("");
            setPreferences("");
            setSelectedSkills([]);
            setAvailability([]);

            setTimeout(() => setSuccessMessageVisible(false), 3000);
        } catch (error) {
            console.error("Error submitting form:", error);
            // @ts-expect-error: error is of unknown type, handled safely in catch block.
            setErrors(error.message ? JSON.parse(error.message) : ["An unknown error occurred."]);
        }
    };
    return (

        <form onSubmit={handleSubmit}>

            {successMessageVisible && (
                <div
                    className={`fixed up-5 left-1/2 transform -translate-x-1/2 mt-4 rounded-lg bg-green-500 text-white p-4 shadow-md z-50`}>
                    Form successfully submitted!
                </div>
            )}

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
                                    onKeyDown={handleKeyDown}
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
                                    onKeyDown={handleKeyDown}
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div className="col-span-full">
                            <label htmlFor="street-address-2" className="block text-sm font-medium leading-6 text-gray-900">
                                Street address 2
                            </label>
                            <div className="mt-2">
                                <input
                                    id="street-address-2"
                                    name="street-address-2"
                                    type="text"
                                    autoComplete="street-address-2"
                                    maxLength={100}
                                    value={streetAddress2}
                                    onChange={(e) => setStreetAddress2(e.target.value)}
                                    onKeyDown={handleKeyDown}
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
                                    onKeyDown={handleKeyDown}
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
                                <StateDropdown selectedState={selectedState} setSelectedState={setSelectedState}/>
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
                                    onKeyDown={handleKeyDown}
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

                    <Dropdown selectedSkills={selectedSkills} setSelectedSkills={setSelectedSkills}/>

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
                    <MultipleDatePicker availability={availability} setAvailability={setAvailability} required={true} />
                </div>
            </div>

            {errors.length > 0 && (
                <div className="mt-4">
                    <h3 className="text-red-500">Please fix the following errors:</h3>
                    <ul className="list-disc list-inside text-red-500">
                        {errors.map((error, index) => (
                            <li key={index}>{error}</li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="mt-6 flex items-center justify-end gap-x-6">
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

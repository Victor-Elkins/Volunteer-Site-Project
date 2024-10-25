import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; 
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import Dropbox from '../Event Managing Form/SkillsDropBox';

// Define the structure of an Event
interface Event {
    id: number;
    name: string;
    date: string; 
    description: string;
    location: string;
    urgency: 'Low' | 'Medium' | 'High' | 'Very High'; 
    skills: string[]; 
}

// Define the structure of the form data
interface formData {
    name: string;
    date: Date;
    description: string;
    location: string;
    urgency: 'Low' | 'Medium' | 'High' | 'Very High'; 
    skills: string[]; 
}


const EventForm = () => {
    const [events, setEvents] = useState<Event[]>([]); 
    const [editingEvent, setEditingEvent] = useState<number | null>(null);
    const [formData, setFormData] = useState<formData>({
        name: '',
        date: new Date(),
        description: '',
        location: '',
        urgency: 'Low',
        skills: []
    });
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    
    // Fetch events from the backend when the component mounts
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/events');
                if (!response.ok) {
                    throw new Error('Failed to fetch events');
                }
                const data: Event[] = await response.json();
                setEvents(data);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };

        fetchEvents();
    }, []);

    // Function to remove event by id
    const removeEvent = async (event1 : Event) => {
        try {
            const response = await fetch(`http://localhost:5000/api/events/${event1.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to remove event');
            }

            setEvents(events.filter(event => event.id !== event1.id));
        } catch (error) {
            console.error('Error removing event:', error);
        }

        try {
            const response = await fetch(`http://localhost:5000/api/volunteer/remove-event/${event1.name}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to remove event from volunteers');
            }
        } catch (error) {
            console.error('Error removing event:', error);
        }
    };

    // Function to add an event
    const addEvent = () => {
        setIsAdding(true);
        setEditingEvent(null); // Clear editing state
        setFormData({
            name: '',
            date: new Date(),
            description: '',
            location: '',
            urgency: 'Low',
            skills: []
        });
        setIsModalOpen(true); // Open modal
    };

    // Function to edit event by id (opens modal and populates form)
    const editEvent = (id: number) => {
        const eventToEdit = events.find(event => event.id === id);
        if (eventToEdit) {
            setEditingEvent(id);
            setFormData({
                name: eventToEdit.name,
                date: new Date(eventToEdit.date), 
                description: eventToEdit.description,
                location: eventToEdit.location,
                urgency: eventToEdit.urgency,
                skills: eventToEdit.skills
            });
            setIsModalOpen(true); // Open modal
        }
    };

    // Handle input change for the form (excluding Date)
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    // Handle date change for DatePicker
    const handleDateChange = (date: Date | null) => {
        if (date) {
            setFormData(prevData => ({
                ...prevData,
                date 
            }));
        }
    };

    // Handle date change for Text Area
    const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    // Handle date change for Skill Change
    const handleSkillChange = (skills: string[]) => {
        setFormData(prevData => ({
            ...prevData,
            skills
        }));
    };

    // Submit the form to either add or update the event
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { name, date, description, location, skills } = formData;
        const today = new Date();
        if (date < today) {
            alert('The event date cannot be in the past.');
            return;
        }
        if (!name || !date || !description || !location || !Array.isArray(skills) || skills.length === 0) {
            alert('All fields are required and at least one skill must be selected.');
            return;
        }

        const dateStr = date.toLocaleDateString();

        const eventPayload = {
            name,
            date: dateStr,
            description,
            location,
            urgency: formData.urgency,
            skills
        };

        try {
            if (editingEvent !== null) {
                // Update existing event
                const response = await fetch(`http://localhost:5000/api/events/${editingEvent}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(eventPayload),
                });

                if (!response.ok) {
                    throw new Error('Failed to update event');
                }

                const updatedEvent = await response.json();
                setEvents(events.map(event =>
                    event.id === editingEvent ? updatedEvent : event
                ));
            } else if (isAdding) {
                // Add new event
                const response = await fetch('http://localhost:5000/api/events', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(eventPayload),
                });

                if (!response.ok) {
                    throw new Error('Failed to add event');
                }

                const newEvent = await response.json();
                setEvents([...events, newEvent]);
            }
    
            setIsModalOpen(false); // Close modal
            setIsAdding(false); // Reset adding state
        } catch (error) {
            console.error('Error submitting event:', error);
        }
    };

    // Function to close the modal
    const closeModal = () => {
        setIsModalOpen(false);
        setEditingEvent(null);
        setIsAdding(false);
    };

    return (
        <div className="p-4 max-w-lg mx-auto bg-white shadow-md rounded-lg">
            <Header />
            <h1 className="text-xl font-bold mb-4">Events</h1>

            {/* Button to open the Add Event modal */}
            <button 
                className="bg-green-500 text-white px-4 py-2 rounded mb-4"
                onClick={addEvent}
            >
                Add Event
            </button>

            <ul className="space-y-2">
                {events.length === 0 ? (
                    <li className="text-gray-500">No Events (Add Some)</li>
                ) : (
                    events.map(event => (
                        <li key={event.id} className="relative border-b border-gray-200">
                            <span className="flex justify-between items-center p-2 pb-1">
                                <span>{event.name}</span>
                                <button className="text-red-500 hover:text-red-700" onClick={() => removeEvent(event)}>
                                    Remove
                                </button>
                            </span>
                            <span className="flex justify-between items-center pl-4 pb-2 text-sm text-gray-500 text-left">
                                <div className="pr-20">
                                    <p>{event.date},  {event.location}</p>
                                    <p>{event.description}</p>
                                    <p><b>Urgency:</b> {event.urgency}</p>
                                    <p><b>Skills Required:</b> {event.skills.join(', ')}</p>
                                </div>
                                <button className="absolute right-1 top-10 text-blue-500 hover:text-blue-700 text-base text-right" onClick={() => editEvent(event.id)}>
                                    Modify
                                </button>
                            </span>
                        </li>
                    ))
                )}
            </ul>

            {/* Modal for Editing or Adding Event */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h2 className="text-lg font-bold mb-2">{isAdding ? 'Add Event' : 'Edit Event'}</h2>
                        <form onSubmit={handleSubmit}>
                            <label className="block mb-2">
                                Name:
                                <input 
                                    type="text" 
                                    name="name" 
                                    value={formData.name} 
                                    onChange={handleChange} 
                                    className="border rounded p-2 w-full"
                                />
                            </label>
                            <label className="block mb-2">
                                Date:&nbsp;
                                <DatePicker
                                    selected={formData.date} 
                                    onChange={handleDateChange}
                                    dateFormat="MM/dd/yyyy"
                                    className="border rounded p-2 w-full"
                                />
                            </label>
                            <label className="block mb-2">
                                Description:
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleTextAreaChange}
                                    className="border rounded p-2 w-full"
                                    rows={4}
                                />
                            </label>
                            <label className="block mb-2">
                                Location:
                                <input 
                                    type="text" 
                                    name="location" 
                                    value={formData.location} 
                                    onChange={handleChange} 
                                    className="border rounded p-2 w-full"
                                />
                            </label>
                            <label className="block mb-2">
                                <Dropbox
                                    selectedSkills={formData.skills} 
                                    onSkillsChange={(selected) => handleSkillChange(selected)} 

                                />
                            </label>
                            <label className="block mb-2">
                                Urgency:
                                <select
                                    name="urgency"
                                    value={formData.urgency}
                                    onChange={handleChange}
                                    className="border rounded p-2 w-full"
                                >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                    <option value="Very High">Very High</option>
                                </select>
                            </label>
                            <div className="flex justify-end space-x-2 mt-4">
                                <button type="button" className="bg-gray-500 text-white px-4 py-2 rounded" onClick={closeModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                                    {isAdding ? 'Add Event' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
};

export default EventForm;
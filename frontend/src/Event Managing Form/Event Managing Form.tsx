import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Import the DatePicker CSS
import Header from '../Components/Header';
import Footer from '../Components/Footer';

const EventForm = () => {
    // Sample events
    const [events, setEvents] = useState([
        { id: 1, name: 'Event1: Pick Up Trash', Date: '9/12/2028', location: 'a street', description: 'Clean the park area.', urgency: 'Medium',  skills: ['Physically Fit']},
        { id: 2, name: 'Event2: Help at local school', Date: '11/15/2077', location: 'b street', description: 'Assist with after-school programs.', urgency: 'High',  
            skills: ['Good with Childern', 'Organizational skills', 'Problem-Solving']},
        { id: 3, name: 'Event3: idk', Date: '2/1/2025', location: 'c street', description: 'To be decided.', urgency: 'Low', skills: ['Health Skills']},
    ]);

    // State for managing the current event being edited and form data
    const [editingEvent, setEditingEvent] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        Date: new Date(),
        description: '',
        location: '',
        urgency: 'Low',
        skills: [] as string[]  
    });
    
    // State for controlling modal visibility and whether it's for editing or adding
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAdding, setIsAdding] = useState(false);

    // Function to remove event by id
    const removeEvent = (id: number) => {
        setEvents(events.filter(event => event.id !== id));
    };

    // Function to add an event
    const addEvent = () => {
        setIsAdding(true);
        setEditingEvent(null); // Clear editing state
        setFormData({
            name: '',
            Date: new Date(),  // Reset Date to current date
            description: '',    // Reset description field
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
                Date: new Date(eventToEdit.Date),  // Convert string to Date object
                description: eventToEdit.description, // Update description field
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
                Date: date
            }));
        }
    };

    const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSkillChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const options = e.target.options;
        const selectedSkills = Array.from(options)
            .filter(option => option.selected)
            .map(option => option.value);
        setFormData(prevData => ({
            ...prevData,
            skills: selectedSkills
        }));
    };

    // Submit the form to either add or update the event
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { name, Date, description, location, skills } = formData;
        if (!name || !Date || !description || !location || !Array.isArray(skills) || skills.length === 0) {
            alert('All fields are required and at least one skill must be selected.');
            return;
        }

        const dateStr = Date.toLocaleDateString();

        if (editingEvent !== null) {
            const updatedEvent = {
                id: editingEvent,
                name,
                Date: dateStr,
                description,
                location,
                urgency: formData.urgency,
                skills
            };
            setEvents(events.map(event =>
                event.id === editingEvent ? updatedEvent : event
            ));
        } else if (isAdding) {
            const newEvent = {
                id: events.length + 1,
                name,
                Date: dateStr,
                description,
                location,
                urgency: formData.urgency,
                skills
            };
            setEvents([...events, newEvent]);
        }

        setIsModalOpen(false);
        setEditingEvent(null);
        setIsAdding(false);
        setFormData({
            name: '',
            Date: new Date(),
            description: '',
            location: '',
            urgency: 'Low',
            skills: []
        });
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
                                <button className="text-red-500 hover:text-red-700" onClick={() => removeEvent(event.id)}>
                                    Remove
                                </button>
                            </span>
                            <span className="flex justify-between items-center pl-4 pb-2 text-sm text-gray-500 text-left">
                                <div className="pr-20">
                                    <p>{event.Date},  {event.location} </p>
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
                                Date:
                                <DatePicker
                                    selected={formData.Date}
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
                                </select>
                            </label>
                            <label className="block mb-2">
                                Required Skills:
                                <select
                                    name="skills"
                                    multiple
                                    value={formData.skills}
                                    onChange={handleSkillChange}
                                    className="border rounded p-2 w-full"
                                >
                                    <option value="Good with Children">Good with Childern</option>
                                    <option value="Problem-Solving">Problem-Solving</option>
                                    <option value="Organizational skills">Organizational skills</option>
                                    <option value="Physically Fit">Physically Fit</option>
                                    <option value="Health Skills">Health Skills</option>
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
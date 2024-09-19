import React, { useState } from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';

const VolunteerMatching = () => {
    
    const [events, setEvents] = useState([
        { id: 1, name: 'Pick Up Trash', Date: '9/12/2028', location: 'a street', description: 'Clean the park area.', urgency: 'Medium',  skills: ['Physically Fit'], peopleAssigned: ["Joe Ng", "Larry Bird", "MJ"]
            , isExpanded: false },
        { id: 2, name: 'Help at local school', Date: '11/15/2077', location: 'b street', description: 'Assist with after-school programs.', urgency: 'High',  
            skills: ['Good with Childern', 'Organizational skills', 'Problem-Solving'], peopleAssigned: ["abd ddd", "asdasd asasd", "Kenn Kerr"], isExpanded: false},
        { id: 3, name: 'Example', Date: '2/1/2025', location: 'c street', description: 'To be decided.', urgency: 'Low', skills: ['Health Skills'], peopleAssigned: ["The asdasd", "asdasd"], isExpanded: false},
    ]);


    const [person, setperson] = useState([
        { id: 1, name: 'Joe Ng', skills: ['Physically Fit, Good with Childern'], EventAssigned: ["Event1"]},
        { id: 2, name: 'Larry Bird', skills: ['Problem-Solving, Health Skills'], EventAssigned: ["Event1, Event2"]},
        { id: 3, name: 'Kenn Kerr', skills: ['Physically Fit, Organizational skils'], EventAssigned: ["Event3"]},
    ]);


    const toggleExpand = (id) => {
        setEvents(events.map(event => 
            event.id === id ? { ...event, isExpanded: !event.isExpanded } : event
        ));
    };

    const [modalOpen, setModalOpen] = useState(false);
    const [currentEvent, setCurrentEvent] = useState(null);
    const [selectedPeople, setSelectedPeople] = useState([]);

    const openModal = (event) => {
        setCurrentEvent(event);
        setSelectedPeople([]); 
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setCurrentEvent(null);
        setSelectedPeople([]);
    };

    const handleCheckboxChange = (person) => {
        setSelectedPeople(prevSelectedPeople =>
            prevSelectedPeople.includes(person)
                ? prevSelectedPeople.filter(p => p !== person)
                : [...prevSelectedPeople, person]
        );
    };

    const handleDelete = () => {
        if (currentEvent) {
            setEvents(events.map(event =>
                event.id === currentEvent.id
                    ? { ...event, peopleAssigned: event.peopleAssigned.filter(person => !selectedPeople.includes(person)) }
                    : event
            ));
            closeModal();
        }
    };


    return (
        <div className="p-4 max-w-3xl mx-auto bg-white shadow-md rounded-lg">  
            <Header />
            <h1 className="text-xl font-bold mb-4">Volunteer Matching Form</h1>
             <div className="flex">
                {/* Left Side */}
                <div className="w-1/2 p-4">
                    <h2 className="text-lg font-semibold mb-4">Event Information</h2>
                    <ul className="space-y-2">
                        {events.length === 0 ? (
                            <li className="text-gray-500">No Events (Add Some)</li>
                        ) : (
                            events.map(event => (
                                <li key={event.id} className="border-b">
                                    <span className="flex justify-between items-center pl-2 pb-1">
                                        <span>{event.name}</span>
                                    </span>
                                    <span className="flex justify-between items-center pl-4 text-sm text-gray-500 text-left">
                                        <div className="pr-20">
                                            <p>{event.description}</p>
                                            <p><b>Urgency:</b> {event.urgency}</p>
                                            <p><b>Skills Required:</b> {event.skills.join(', ')}</p>
                                        </div>
                                    </span>
                                    <div className="flex justify-start">
                                        <button 
                                            className="text-blue-500 hover:text-blue-700  pl-4 text-sm" 
                                            onClick={() => toggleExpand(event.id)}
                                        >
                                            {event.isExpanded ? 'Hide People Assigned' : 'View People Assigned'}
                                        </button>
                                    </div>
                                    {/* Conditional Rendering of People Assigned */}
                                    {event.isExpanded && (
                                        <div className="text-left pl-4 text-sm">
                                            <p><b>People Assigned:</b></p>
                                            <ul className="list-disc pl-5 text-gray-600 text-left">
                                                {event.peopleAssigned.map((person, index) => (
                                                    <li key={index}>{person}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    <div className="flex justify-start">
                                        <p className=" pb-2 pl-4 text-sm">
                                            <button 
                                                className="text-green-500 hover:text-green-700 pr-1 text-sm" 
                                                onClick={() => openModal(event)}
                                            > Add
                                            </button>
                                            or 
                                            <button 
                                                className="text-red-500 hover:text-red-700 pl-1 pr-1 text-sm" 
                                                onClick={() => openModal(event)}
                                            > Delete
                                            </button> 
                                             People
                                        </p>
                                       
                                    </div>
                                
                                </li>
                            ))
                        )}
                    </ul>
                </div>

                {/* Right Side */}
                <div className="w-1/2 p-4">
                    <h2 className="text-lg font-semibold mb-4">Volunteer Information</h2>
                    <ul className="space-y-4">
                        {person.map(p => (
                            <li key={p.id} className="border-b border-gray-200 pb-1 text-left text-sm ">
                                <p className="text-lg pb-1">{p.name}</p>
                                
                                <div className="pr-20 text-gray-500 pl-2">
                                    <p><b>Skills:</b> {p.skills.join(', ')}</p>
                                    <p><b>Events Assigned:</b> {p.EventAssigned.join(', ')}</p>
                                </div>
                                <div className="pl-2">
                                    <p className=" pb-2  text-sm">
                                        <button 
                                            className="text-green-500 hover:text-green-700 pr-1 text-sm" 
                                            onClick={() => openModal(event)}
                                        > Add
                                        </button>
                                        or 
                                        <button 
                                            className="text-red-500 hover:text-red-700 pl-1 pr-1 text-sm" 
                                            onClick={() => openModal(event)}
                                        > Delete
                                        </button> 
                                        Events
                                     </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            {modalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                        <h2 className="text-lg font-semibold mb-4">Manage People Assigned</h2>
                        <div>
                            <p><b>Event:</b> {currentEvent?.name}</p>
                            <p><b>Current People Assigned:</b></p>
                            <ul>
                                {currentEvent?.peopleAssigned.map((person, index) => (
                                    <div className="flex">
                                        <span className="w-1/3"></span>
                                        <li key={index} className="flex items-start">
                                            <input
                                                type="checkbox"
                                                checked={selectedPeople.includes(person)}
                                                onChange={() => handleCheckboxChange(person)}
                                                className="mr-2 mt-2"
                                            />
                                            <span className="text-left">{person}</span>
                                        </li>
                                    </div>
                                    
                                ))}
                            </ul>
                            <button
                                className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                                onClick={handleDelete}
                            >
                                Delete Selected People
                            </button>
                        </div>
                        <button
                            className="mt-4 text-gray-500 hover:text-gray-700"
                            onClick={closeModal}
                        >
                            Close
                        </button>
                     </div>
                </div>
            )}
            <Footer />
        </div>
    );
};


export default VolunteerMatching;
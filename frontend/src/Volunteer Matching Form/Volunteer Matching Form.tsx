import React, { useState, useEffect } from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';

// Define types for Event and Volunteer data
interface Volunteer {
  id: number;
  name: string;
  skills: string[];
  EventAssigned: string[];
}

interface Event {
  id: number;
  name: string;
  date: string;
  description: string;
  location: string;
  urgency: string;
  skills: string[];
  peopleAssigned: string[];
  isExpanded?: boolean; 
}

const VolunteerMatching = () => {
  // State hooks
  const [events, setEvents] = useState<Event[]>([]); // Use the Event type
  const [person, setPerson] = useState<Volunteer[]>([]); // Use the Volunteer type
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);
  const [matchingVolunteers, setMatchingVolunteers] = useState<Volunteer[]>([]); // Holds volunteers matching the required skills
  const [modalAction, setModalAction] = useState<'add' | 'delete' | null>(null);

  // Fetch events and volunteers on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch events from backend
        const eventsResponse = await fetch('/api/events'); // Adjust this to your backend route
        const eventsData: Event[] = await eventsResponse.json();
        setEvents(eventsData);

        // Fetch volunteers from backend
        const volunteersResponse = await fetch('/api/volunteer'); // Adjust this to your backend route
        const volunteersData: Volunteer[] = await volunteersResponse.json();
        setPerson(volunteersData);

        setLoading(false); // Mark loading as done
      } catch (err) {
        setError('Failed to fetch data.');
        setLoading(false); // In case of error, stop loading
      }
    };

    fetchData();
  }, []);

  // Toggle expand/collapse for each event
  const toggleExpand = (id: number) => {
    setEvents(events.map(event =>
      event.id === id ? { ...event, isExpanded: !event.isExpanded } : event
    ));
  };

  // Open modal and set current event
  const openModal = async (event: Event, action: 'add' | 'delete') => {
    setCurrentEvent(event);
    setSelectedPeople([]);
    
    if (action === 'add') {
      // Fetch volunteers that match the required skills for this event
      const skillsQuery = event.skills.join(',');
      const response = await fetch(`/api/volunteer/with-skills?skills=${skillsQuery}`);
      const matchingData: Volunteer[] = await response.json();
      setMatchingVolunteers(matchingData); // Set volunteers matching the skills
    } else {
      setMatchingVolunteers([]); // Clear matching volunteers if not adding
    }

    setModalAction(action); 
    setModalOpen(true);
};

  // Close modal
  const closeModal = () => {
    setModalOpen(false);
    setCurrentEvent(null);
    setSelectedPeople([]);
  };

  // Handle checkbox change for selecting people
  const handleCheckboxChange = (person: string) => {
    setSelectedPeople(prevSelectedPeople =>
      prevSelectedPeople.includes(person)
        ? prevSelectedPeople.filter(p => p !== person)
        : [...prevSelectedPeople, person]
    );
  };

  // Handle delete of selected people
  const handleDelete = () => {
    if (currentEvent) {
        const updatedPeople = currentEvent.peopleAssigned.filter(person => !selectedPeople.includes(person));
        setEvents(events.map(event =>
            event.id === currentEvent.id
                ? { ...event, peopleAssigned: updatedPeople }
                : event
        ));
        updateEventPeople(currentEvent.id, updatedPeople); // Call API to sync with backend
        closeModal();
    }
};

  const handleAdd = () => {
    if (currentEvent) {
        const updatedPeople = [...currentEvent.peopleAssigned, ...selectedPeople];
        setEvents(events.map(event =>
            event.id === currentEvent.id
                ? { ...event, peopleAssigned: updatedPeople }
                : event
        ));
        updateEventPeople(currentEvent.id, updatedPeople); // Call API to sync with backend
        closeModal();
    }
  };

const updateEventPeople = async (eventId: number, updatedPeople: string[]) => {
  try {
      const response = await fetch(`/api/events/${eventId}/update-people`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ peopleAssigned: updatedPeople }),
      });

      if (!response.ok) {
          throw new Error('Failed to update event');
      }

      const data = await response.json();
      console.log('Event updated:', data);
  } catch (error) {
      console.error('Error updating event:', error);
  }
};

  // Return loading or error messages if applicable
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-4 max-w-3xl mx-auto bg-white shadow-md rounded-lg">
      <Header />
      <h1 className="text-xl font-bold mb-4">Volunteer Matching Form</h1>
      <div className="flex">
        {/* Left Side - Event Information */}
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
                      className="text-blue-500 hover:text-blue-700 pl-4 text-sm"
                      onClick={() => toggleExpand(event.id)}
                    >
                      {event.isExpanded ? 'Hide People Assigned' : 'View People Assigned'}
                    </button>
                  </div>
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
                    <p className="pb-2 pl-4 text-sm">
                      <button
                        className="text-green-500 hover:text-green-700 pr-1 text-sm"
                        onClick={() => openModal(event, 'add')}
                      >
                        Add
                      </button>
                      or
                      <button
                        className="text-red-500 hover:text-red-700 pl-1 pr-1 text-sm"
                        onClick={() => openModal(event, 'delete')}
                      >
                        Delete
                      </button>
                      People
                    </p>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Right Side - Volunteer Information */}
        <div className="w-1/2 p-4">
          <h2 className="text-lg font-semibold mb-4">Volunteer Information</h2>
          <ul className="space-y-4">
            {person.map(volunteer => (
              <li key={volunteer.id} className="border-b border-gray-200 pb-1 text-left text-sm">
                <p className="text-lg pb-1">{volunteer.name}</p>
                <div className="pr-20 text-gray-500 pl-2">
                  <p><b>Skills:</b> {volunteer.skills.join(', ')}</p>
                  <p><b>Events Assigned:</b> {volunteer.EventAssigned.join(', ')}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-lg font-semibold mb-4">
              {modalAction === 'add' ? 'Add People to Event' : 'Delete People from Event'}
            </h2>
            <div>
              <p><b>Event:</b> {currentEvent?.name}</p>
              {modalAction === 'delete' ? (
                <>
                  <p><b>Current People Assigned:</b></p>
                  <ul>
                    {currentEvent?.peopleAssigned?.map((person, index) => (
                      <div key={index} className="flex">
                        <li className="flex items-start">
                          <input
                            type="checkbox"
                            checked={selectedPeople.includes(person)}
                            onChange={() => handleCheckboxChange(person)}
                            className="mr-2 mt-2"
                          />
                          <span>{person}</span>
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
                </>
              ) : (
                <>
                  {matchingVolunteers.length > 0 ? (
                    <>
                      <p><b>Matching Volunteers:</b></p>
                      <ul>
                        {matchingVolunteers.map((volunteer) => (
                          <div key={volunteer.id} className="flex">
                            <li className="flex items-start">
                              <input
                                type="checkbox"
                                checked={selectedPeople.includes(volunteer.name)}
                                onChange={() => handleCheckboxChange(volunteer.name)}
                                className="mr-2 mt-2"
                              />
                              <span>{volunteer.name}</span>
                            </li>
                          </div>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <p>No volunteers match the required skills.</p>
                  )}
                  <button
                    className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
                    onClick={handleAdd}
                  >
                    Add Selected People
                  </button>
                </>
              )}
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
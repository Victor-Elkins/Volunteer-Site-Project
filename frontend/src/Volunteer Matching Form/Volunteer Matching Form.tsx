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
  urgency: number;
  skills: string[];
  peopleAssigned: number[];
  isExpanded?: boolean; 
}

const VolunteerMatching = () => {
  const [events, setEvents] = useState<Event[]>([]); // Use the Event type
  const [person, setPerson] = useState<Volunteer[]>([]); // Use the Volunteer type
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [selectedPeople, setSelectedPeople] = useState<number[]>([]); 
  const [matchingVolunteers, setMatchingVolunteers] = useState<Volunteer[]>([]); // Holds volunteers matching the required skills
  const [modalAction, setModalAction] = useState<'add' | 'delete' | null>(null);
  
  // Fetch events and volunteers 
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch events from backend
        const eventsResponse =  await fetch('http://localhost:5000/api/events');
        const eventsData: Event[] = await eventsResponse.json();
        console.log(eventsData)
        setEvents(eventsData);

        // Fetch volunteers from backend
        const volunteersResponse = await fetch('http://localhost:5000/api/volunteer')
        const volunteersData: Volunteer[] = await volunteersResponse.json();
        console.log(volunteersData)
        setPerson(volunteersData);

        setLoading(false); 
      } catch (err) {
        setError('Failed to fetch data.');
        setLoading(false); 
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
    try {
      setCurrentEvent(event);
      setSelectedPeople([]);
  
      if (action === 'add') {
        // Fetch volunteers that match the required skills for this event
        const skillsQuery = event.skills.join(',');
        const eventName = encodeURIComponent(event.name); // Ensure event name is URL-safe
  
        const response = await fetch(`http://localhost:5000/api/volunteer/with-skills?skills=${skillsQuery}&eventName=${eventName}`);
        const matchingData: Volunteer[] = await response.json();
        console.log(matchingData)
        // Filter out volunteers who are already assigned to this event
        const filteredVolunteers = matchingData.filter(volunteer => !event.peopleAssigned.includes(volunteer.id));
        console.log(filteredVolunteers)

        setMatchingVolunteers(filteredVolunteers);
      } else {
        setMatchingVolunteers([]);
      }
  
      setModalAction(action); 
      setModalOpen(true);
    } catch (error) {
      setError('Failed to fetch matching volunteers.');
      console.log("Error:", error);
    }
  };

  // Close modal
  const closeModal = () => {
    setModalOpen(false);
    setCurrentEvent(null);
    setSelectedPeople([]);
  };

  const handleCheckboxChange = (id: number) => {
    setSelectedPeople(prevSelectedPeople =>
        prevSelectedPeople.includes(id)
            ? prevSelectedPeople.filter(p => p !== id)
            : [...prevSelectedPeople, id]
    );
  };

  // Handle delete of selected people
  const handleDelete = async () => {
    if (currentEvent) {
      const peopleToDelete = selectedPeople;
      setSelectedPeople([]);
      const updatedPeople = currentEvent.peopleAssigned.filter(id => !peopleToDelete.includes(id));
      setEvents(events.map(event =>
        event.id === currentEvent.id
          ? { ...event, peopleAssigned: updatedPeople }
          : event
      ));
  
      const updatedVolunteers = person.map(volunteer => {
        if (peopleToDelete.includes(volunteer.id)) {
          return {
            ...volunteer,
            EventAssigned: volunteer.EventAssigned.filter(eventName => eventName !== currentEvent.name), // Remove current event
          };
        }
        return volunteer;
      });
  
      setPerson(updatedVolunteers);
  
      await updateEventPeople(currentEvent.id, [], currentEvent.date, peopleToDelete);
  
      closeModal();
    }
  };


  // Handle add of selected people
  const handleAdd = async () => {
    if (currentEvent) {
      let updatedPeople = [...new Set([...currentEvent.peopleAssigned, ...selectedPeople])];
      
      setSelectedPeople([]);

      setEvents(events.map(event =>
        event.id === currentEvent.id
          ? { ...event, peopleAssigned: updatedPeople }
          : event
      ));

      const updatedVolunteers = person.map(volunteer => {
        if (selectedPeople.includes(volunteer.id)) {
          return {
            ...volunteer,
            EventAssigned: [...new Set([...volunteer.EventAssigned, currentEvent.name])], 
          };
        }
        return volunteer;
      });
  
      setPerson(updatedVolunteers);  
  
      updatedPeople = selectedPeople;
      
      await updateEventPeople(currentEvent.id, updatedPeople, currentEvent.date, []); 
  
      closeModal();
    }
  };

  // Update the backend with the new assigned people
  const updateEventPeople = async (eventId: number, updatedPeople: number[], eventDate: string, peopleToDelete: number[]) => {
    try {
      // Call the API to update the volunteers
      console.log("Updated People:", updatedPeople);
      const response = await fetch(`http://localhost:5000/api/volunteer/update-people`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            eventId: eventId,               
            peopleAssigned: updatedPeople,  
            eventDate: eventDate,
            peopleToDelete: peopleToDelete,  
        }),
      });

      if (!response.ok) {
          throw new Error('Failed to update event');
      }

      const data = await response.json();
      console.log('Volunteers updated:', data);
  } catch (error) {
      console.error('Error updating volunteers:', error);
  }

  };


  // Return loading or error messages if applicable
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Convert number into urgency
  const getUrgencyLabel = (urgency: number) => {
    switch (urgency) { 
      case 1:return 'Low';
      case 2:return 'Medium';
      case 3:return 'High';
      case 4:return 'Very High';
      case 5:return 'Urgent';
      default:return 'Unknown';
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto bg-white shadow-md rounded-lg">
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
                  <span className="flex justify-between items-center pl-2 pb-1 text-lg">
                    <span>{event.name}</span>
                  </span>
                  <span className="flex justify-between items-center pl-4 text-sm text-gray-500 text-left">
                    <div className="pr-5">
                      <p>{event.description}</p>
                      <p><b>Urgency:</b> {getUrgencyLabel(event.urgency)}</p>
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
                        {event.peopleAssigned.map((assignedId, index) => {
                          const volunteer = person.find(v => v.id === assignedId);
                          return (
                            <li key={index}>
                              {volunteer ? volunteer.name : 'Unknown Volunteer'}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                  <div className="flex justify-start">
                    <p className="pb-2 pl-4 text-sm">
                      <button
                        className="text-green-500 hover:text-green-700 pr-1 text-sm"
                        onClick={() => {
                          console.log('Add button clicked for event:', event.name); // Debugging log
                          openModal(event, 'add');
                        }}
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
                  <p><b>Event(s) Assigned:</b> {volunteer.EventAssigned.join(', ')}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Modal the opens depending on adding or removing people from events */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-lg font-semibold mb-4">
              {modalAction === 'add' ? 'Add People to Event' : 'Delete People from Event'}
            </h2>
            <div>
              <p><b>Event:</b> {currentEvent?.name}</p>
              {/* Modal for deleting people*/}
              {modalAction === 'delete' ? (
                <>
                  <p><b>Current People Assigned:</b></p>
                  <ul className="flex flex-col">
                    {currentEvent?.peopleAssigned?.map(assignedId => {
                    const volunteer = person.find(v => v.id === assignedId);
                    return (
                      <li key={assignedId} className="flex items-center">
                        <span className = "w-1/3"></span>
                        <label>
                          <input
                            type="checkbox"
                            checked={selectedPeople.includes(assignedId)}
                            onChange={() => handleCheckboxChange(assignedId)}
                            className="mr-2"
                          />
                          {volunteer ? volunteer.name : 'Unknown Volunteer'}
                        </label>
                      </li>
                    );
                  })}
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
                {/* Modal for adding people */}
                  {matchingVolunteers.length > 0 ? (
                    <>
                      <p><b>Matching Volunteers:</b></p>
                      <ul>
                        {matchingVolunteers.map((volunteer) => (
                          <div key={volunteer.id} className="flex">
                            <span className = "w-1/3"></span>
                            <li className="flex items-start">
                              <input
                                type="checkbox"
                                checked={selectedPeople.includes(volunteer.id)}
                                onChange={() => handleCheckboxChange(volunteer.id)}
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
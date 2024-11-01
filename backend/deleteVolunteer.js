const sqlite3 = require('sqlite3').verbose();
const db = require('./db');

// Function to update UserProfile skills based on their assigned events
// Function to make event names unique
function makeEventNamesUnique() {

    peopleAssigned = [435]
    console.log(peopleAssigned)
    eventId = 3
    eventDate = "2025-07-23"
    const addPeopleQuery = `
    INSERT INTO VolunteerHistory (user_id, event_id, participation_date, session_active)
    VALUES (?, ?, ?, 1)`;

    for (const volunteerId of peopleAssigned) {
        console.log("Got Here with " + volunteerId)
        console.log("Event Date: " + eventDate)
        try {
            db.run(addPeopleQuery, [volunteerId, eventId, eventDate]);
            console.log("Inserted volunteer ID: " + volunteerId + " for event ID: " + eventId);
        } catch (error) {
            console.error("Error inserting volunteer: ", error);
        }
    }
}

// Call the function to make event names unique
makeEventNamesUnique();

// Close the database connection when done
db.close(err => {
    if (err) {
        console.error('Error closing database:', err.message);
    } else {
        console.log('Database connection closed.');
    }
});
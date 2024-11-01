const express = require('express');
const { body, param, validationResult } = require('express-validator');
const router = express.Router();

// Update to accept a db parameter
const createVolunteerRouter = (db) => {
    // GET route to get all volunteers with their assigned events
    router.get('/', (req, res) => {
        const query = `
            SELECT 
                UserProfile.id AS user_id,
                UserProfile.full_name AS name,
                UserProfile.skills,
                EventDetails.event_name
            FROM UserProfile
            LEFT JOIN VolunteerHistory 
                ON UserProfile.id = VolunteerHistory.user_id 
                AND VolunteerHistory.session_active = 1
            LEFT JOIN EventDetails 
                ON VolunteerHistory.event_id = EventDetails.id
            ORDER BY UserProfile.id;
        `;

        db.all(query, [], (err, rows) => {
            if (err) {
                console.error('Error retrieving volunteer data:', err.message);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            // Create a map to organize events by volunteer ID
            const volunteersMap = {};

            rows.forEach(row => {
                // Initialize volunteer in map if not present
                if (!volunteersMap[row.user_id]) {
                    volunteersMap[row.user_id] = {
                        id: row.user_id,
                        name: row.name,
                        skills: row.skills ? row.skills.split(',').map(skill => skill.trim()) : [], // Split and trim skills
                        EventAssigned: [] // Array for assigned event names
                    };
                }

                // Add event name if available
                if (row.event_name) {
                    volunteersMap[row.user_id].EventAssigned.push(row.event_name);
                }
            });

            // Convert the volunteers map into an array
            const volunteers = Object.values(volunteersMap);

            // Send the response with the volunteers and their active events
            res.status(200).json(volunteers);
        });
    });

    // Route to get volunteers with required skills who are not assigned to the event
    router.get('/with-skills', (req, res) => {
        try {
            const requiredSkills = req.query.skills ? req.query.skills.split(',').map(skill => skill.trim().toLowerCase()) : [];
            const eventName = req.query.eventName;

            if (!eventName || requiredSkills.length === 0) {
                return res.status(400).json({ message: 'Event name and required skills are required.' });
            }

            // Query to find users with matching skills
            const skillsQuery = requiredSkills.map(skill => `LOWER(UserProfile.skills) LIKE '%${skill}%'`).join(' AND ');

            const query = `
                SELECT DISTINCT UserProfile.id, UserProfile.full_name, UserProfile.skills
                FROM UserProfile
                LEFT JOIN VolunteerHistory ON UserProfile.id = VolunteerHistory.user_id
                WHERE ${skillsQuery}
                  AND (VolunteerHistory.event_id IS NULL OR VolunteerHistory.event_id != (
                      SELECT id FROM EventDetails WHERE event_name = ?
                  ))
            `;

            db.all(query, [eventName], (err, rows) => {
                if (err) {
                    console.error('Error fetching volunteers:', err);
                    return res.status(500).json({ message: 'An error occurred while fetching volunteers.', error: err.message });
                }

                // Transform the data into the expected structure for the frontend
                const transformedRows = rows.map(row => ({
                    id: row.id,
                    name: row.full_name,
                    skills: row.skills.split(',').map(skill => skill.trim()), // Convert skills to an array
                    EventAssigned: []  // Since this isn't fetched, leave as an empty array
                }));
                
                res.status(200).json(transformedRows);
            });
            
        } catch (error) {
            console.error('Unexpected error:', error);
            res.status(500).json({ message: 'An unexpected error occurred.', error });
        }
    });

    // PUT route that updates volunteer events assigned 
    router.put('/update-people', async (req, res) => {
        const { eventId, peopleAssigned, eventDate, peopleToDelete } = req.body;
        try {
            // Validate that peopleAssigned and peopleToDelete are arrays
            if (!Array.isArray(peopleAssigned) || !Array.isArray(peopleToDelete)) {
                return res.status(400).json({ message: 'peopleAssigned and peopleToDelete must be arrays' });
            }

            // Insert new entries into VolunteerHistory for peopleAssigned
            const addPeopleQuery = `
                INSERT INTO VolunteerHistory (user_id, event_id, participation_date, session_active)
                VALUES (?, ?, ?, 1)`;

            for (const volunteerId of peopleAssigned) {
                try {
                    db.run(addPeopleQuery, [volunteerId, eventId, eventDate]);
                } catch (error) {
                    console.error("Error inserting volunteer: ", error);
                }
            }

            // Remove entries from VolunteerHistory for peopleToDelete
            const deletePeopleQuery = `
                DELETE FROM VolunteerHistory WHERE user_id = ? AND event_id = ? AND session_active = 1`;

            for (const volunteerId of peopleToDelete) {
                await db.run(deletePeopleQuery, [volunteerId, eventId]);
            }

            res.status(200).json({ message: 'Event and volunteers updated successfully.' });
        } catch (error) {
            console.error('Error updating event people:', error);
            res.status(500).json({ message: 'An error occurred while updating the event and volunteers.', error });
        }
    });

    return router;
};

module.exports = createVolunteerRouter;
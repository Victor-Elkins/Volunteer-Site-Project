const db = require('./db'); 

async function updateEventsAndVolunteers() {
    // Array of skills to assign
    const skillsOptions = [
        'Project Management',
        'Team Leadership',
        'Event Coordination',
        'Public Speaking',
        'Data Analysis',
        'Fundraising',
        'Marketing',
    ];

    // Fetch all events
    const getEventsQuery = 'SELECT * FROM EventDetails';

    db.all(getEventsQuery, [], (err, events) => {
        if (err) {
            console.error("Error fetching events:", err);
            return;
        }

        events.forEach(event => {
            // Replace skills with a random selection from skillsOptions
            const selectedSkills = skillsOptions
                .sort(() => 0.5 - Math.random()) // Shuffle the skills
                .slice(0, Math.floor(Math.random() * 4) + 1) // Select 1 to 4 skills
                .join(','); // Convert to string
            
            const updateEventSkillsQuery = `
                UPDATE EventDetails 
                SET required_skills = ? 
                WHERE id = ?
            `;
            
            db.run(updateEventSkillsQuery, [selectedSkills, event.id], (updateErr) => {
                if (updateErr) {
                    console.error("Error updating event skills:", updateErr);
                }
            });
        });

        // Clear VolunteerHistory
        const clearVolunteerHistoryQuery = 'DELETE FROM VolunteerHistory';
        db.run(clearVolunteerHistoryQuery, [], (clearErr) => {
            if (clearErr) {
                console.error("Error clearing volunteer history:", clearErr);
                return;
            }

            // Fetch all volunteers
            const getVolunteersQuery = 'SELECT * FROM UserProfile';
            db.all(getVolunteersQuery, [], (volunteerErr, volunteers) => {
                if (volunteerErr) {
                    console.error("Error fetching volunteers:", volunteerErr);
                    return;
                }

                volunteers.forEach(volunteer => {
                    // Assign 1 to 3 events to each volunteer
                    const assignedEvents = events.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 1);
                    assignedEvents.forEach(event => {
                        const participationDate = event.event_date; // Use event's date
                        const participationStatus = new Date(participationDate) < new Date() ? 0 : 1; // Determine session_active

                        const insertVolunteerHistoryQuery = `
                            INSERT INTO VolunteerHistory (user_id, event_id, participation_date, session_active) 
                            VALUES (?, ?, ?, ?)
                        `;
                        
                        db.run(insertVolunteerHistoryQuery, [volunteer.id, event.id, participationDate, participationStatus], (insertErr) => {
                            if (insertErr) {
                                console.error("Error inserting volunteer history:", insertErr);
                            }
                        });
                    });

                    // Update volunteer skills to include all skills from assigned events without duplicates
                    const updatedSkills = [...new Set(assignedEvents.flatMap(event => event.required_skills.split(',')))].join(',');
                    const updateVolunteerSkillsQuery = `
                        UPDATE UserProfile 
                        SET skills = ? 
                        WHERE id = ?
                    `;
                    
                    db.run(updateVolunteerSkillsQuery, [updatedSkills, volunteer.id], (updateVolunteerErr) => {
                        if (updateVolunteerErr) {
                            console.error("Error updating volunteer skills:", updateVolunteerErr);
                        }
                    });
                });
            });
        });
    });
}

updateEventsAndVolunteers();

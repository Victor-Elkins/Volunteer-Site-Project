const express = require('express');
const { body, param, validationResult } = require('express-validator');
const router = express.Router();

// Hardcoded events array (Should be replaced with database)
const volunteers = [
    { id: 1, name: 'John Doe', skills: ['Physically Fit', 'Good with Childern'], EventAssigned: ["Event One"] },
    { id: 2, name: 'Jane Smith', skills: ['Problem-Solving', 'Health Skills', 'Physically Fit'], EventAssigned: ["Event One", "Event Two"] },
    { id: 3, name: 'Steven Lang', skills: ['Team Leadership', 'Data Analysis', 'Marketing', 'Physically Fit'], EventAssigned: [] },
    { id: 4, name: 'Brandon James', skills: ['Public Speaking', 'Fundraising'], EventAssigned: [] },
    { id: 5, name: 'Emily Lee', skills: ['Fundraising', 'Public Speaking', 'Problem-Solving'], EventAssigned: [] },
    { id: 6, name: 'Derrick Kidd', skills: ['Marketing', 'Organizational skills', 'Public Speaking'], EventAssigned: ["Event Three"] },
  ];

// GET route to get all volunteers
router.get('/', (req, res) => {
    try {
        res.status(200).json(volunteers);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while fetching volunteers.', error });
    }
});

// Replace with query search of database 
// GET route to get volunteers with required skills who are not assigned to the event
// GET route to get volunteers with required skills who are not assigned to the event
router.get('/with-skills', (req, res) => {
    try {
        const requiredSkills = req.query.skills ? req.query.skills.split(',').map(skill => skill.trim()) : [];
        const eventName = req.query.eventName; // Get the event name from query parameters

        const filteredVolunteers = volunteers.filter(volunteer => {
            // Check if the volunteer matches the required skills
            const hasRequiredSkills = requiredSkills.every(skill =>
                volunteer.skills.some(vSkill => vSkill.toLowerCase() === skill.toLowerCase())
            );

            // Check if the volunteer is either not assigned to the event or has just been removed
            const notAssignedToEvent = !volunteer.EventAssigned.includes(eventName) || (volunteer.EventAssigned.length === 0);

            return hasRequiredSkills && notAssignedToEvent;
        });

        res.status(200).json(filteredVolunteers);
    } catch (error) {
        console.error('Error fetching volunteers:', error);
        res.status(500).json({ message: 'An error occurred while fetching volunteers.', error });
    }
});

// PUT route that updates volunteer events assigned 
router.put('/events/:eventId/update-people', (req, res) => {
    const { eventId } = req.params;
    const { peopleAssigned, eventName, peopleToDelete } = req.body; 
    try {
        peopleAssigned.forEach(personName => {
            const volunteer = volunteers.find(v => v.name === personName);
            if (volunteer && !volunteer.EventAssigned.includes(eventName)) {
                volunteer.EventAssigned.push(eventName);
            }
        });

        peopleToDelete.forEach(personName => {
            const volunteer = volunteers.find(v => v.name === personName);
            if (volunteer) {
                volunteer.EventAssigned = volunteer.EventAssigned.filter(event => event !== eventName);
            }
        });

        // Respond with the updated volunteers
        res.status(200).json({ message: 'Event and volunteers updated successfully.', volunteers });
    } catch (error) {
        console.error('Error updating event people:', error);
        res.status(500).json({ message: 'An error occurred while updating the event and volunteers.', error });
    }
});

module.exports = router;
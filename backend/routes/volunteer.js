const express = require('express');
const { body, param, validationResult } = require('express-validator');
const router = express.Router();

// Hardcoded events array (Should be replaced with database)
const volunteers = [
    { id: 1, name: 'Joe Ng', skills: ['Physically Fit', 'Good with Childern'], EventAssigned: ["Event1"] },
    { id: 2, name: 'Larry Bird', skills: ['Problem-Solving', 'Health Skills'], EventAssigned: ["Event1, Event2"] },
    { id: 3, name: 'Kenn Kerr', skills: ['Physically Fit', 'Organizational skills'], EventAssigned: ["Event3"] },
  ];

// GET route to get all volunteers
router.get('/', (req, res) => {
    try {
        res.status(200).json(volunteers);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while fetching volunteers.', error });
    }
});

// Get route to get all volunteers with required skills 
// Replace with query search of database 
router.get('/with-skills', (req, res) => {
    try {
        const requiredSkills = req.query.skills ? req.query.skills.split(',').map(skill => skill.trim()) : [];
        const filteredVolunteers = volunteers.filter(volunteer =>
            requiredSkills.every(skill => volunteer.skills.some(vSkill => vSkill.toLowerCase() === skill.toLowerCase()))
        );
        res.status(200).json(filteredVolunteers);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while fetching volunteers with skills.', error });
    }
});

module.exports = router;
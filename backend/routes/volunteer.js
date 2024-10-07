const express = require('express');
const { body, param, validationResult } = require('express-validator');
const router = express.Router();

// Sample volunteer data 
const volunteers = [
    { id: 1, name: 'Joe Ng', skills: ['Physically Fit, Good with Childern'], EventAssigned: ["Event1"]},
    { id: 2, name: 'Larry Bird', skills: ['Problem-Solving, Health Skills'], EventAssigned: ["Event1, Event2"]},
    { id: 3, name: 'Kenn Kerr', skills: ['Physically Fit, Organizational skils'], EventAssigned: ["Event3"]},
];

// GET all volunteers
router.get('/', (req, res) => {
    try {
        // Return the volunteer list (normally you would fetch this data from a database)
        res.status(200).json(volunteers);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while fetching volunteers.', error });
    }
});

module.exports = router;
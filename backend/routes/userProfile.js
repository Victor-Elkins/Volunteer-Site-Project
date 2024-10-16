const express = require('express');
const { body, validationResult } = require('express-validator');
const users = require('../users');

const router = express.Router();

// Create or Update User Profile
router.post(
    '/',
    [
        body('fullName')
            .isLength({ max: 50 }).withMessage('Full Name must be at most 50 characters')
            .notEmpty().withMessage('Full Name is required')
            .isString().withMessage('Full Name must be a string'),

        body('streetAddress')
            .isLength({ max: 100 }).withMessage('Address 1 must be at most 100 characters')
            .notEmpty().withMessage('Street Address is required')
            .isString().withMessage('Street Address must be a string'),

        body('streetAddress2')
            .optional()
            .isLength({ max: 100 }).withMessage('Street Address 2 must be at most 100 characters')
            .isString().withMessage('Street Address 2 must be a string'),

        body('city')
            .isLength({ max: 100 }).withMessage('City must be at most 100 characters')
            .notEmpty().withMessage('City is required')
            .isString().withMessage('City must be a string'),

        body('state')
            .isLength({ min: 2, max: 2 }).withMessage('State code must be exactly 2 characters')
            .notEmpty().withMessage('State is required')
            .isString().withMessage('State must be a string'),

        body('postalCode')
            .isLength({ min: 5, max: 9 }).withMessage('Zip Code must be between 5 and 9 characters')
            .notEmpty().withMessage('Zip Code is required')
            .isString().withMessage('Zip Code must be a string'),

        body('skills')
            .isArray({ min: 1 }).withMessage('Skills must be an array with at least one skill'),

        body('preferences')
            .optional()
            .isString().withMessage('Preferences must be a string'),

        body('availability')
            .isArray({ min: 1 }).withMessage('Availability must be an array with at least one date'),
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id, fullName, streetAddress, streetAddress2, city, state, postalCode, skills, preferences, availability } = req.body;

        const existingUserIndex = users.findIndex(user => user.id === parseInt(id));

        if (existingUserIndex !== -1) {
            users[existingUserIndex] = {
                id: parseInt(id),
                fullName,
                streetAddress,
                streetAddress2,
                city,
                state,
                postalCode,
                skills,
                preferences: preferences || [],
                availability,
            }
            return res.status(200).json(profiles[existingUserIndex]);
        }

        const newProfile = {
            id: users.length + 1,
            fullName: req.body.fullName,
            streetAddress: req.body.streetAddress,
            city: req.body.city,
            state: req.body.state,
            postalCode: req.body.postalCode,
            skills: req.body.skills,
            preferences: req.body.preferences || [], // optional
            availability: req.body.availability,
        };

        if (req.body.preferences) {
            newProfile.preferences = req.body.preferences;
        }
        if (req.body.streetAddress2) {
            newProfile.streetAddress2 = req.body.streetAddress2;
        }

        users.push(newProfile);
        res.status(201).json(newProfile); // Created profile response
    }
);


router.get('/', (req, res) => {
    res.json(users);
});

router.get('/:id', (req, res) => {
    const profile = users.find(p => p.id === parseInt(req.params.id));
    if (!profile) {
        return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile);
});

module.exports = router;

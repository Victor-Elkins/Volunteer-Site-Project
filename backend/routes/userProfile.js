const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../db');
const { promisify } = require('util');

const router = express.Router();

// Create or Update User Profile
router.post(
    '/',
    [
        body('full_name')
            .isLength({ max: 50 }).withMessage('Full Name must be at most 50 characters')
            .notEmpty().withMessage('Full Name is required')
            .isString().withMessage('Full Name must be a string'),

        body('address_1')
            .isLength({ max: 100 }).withMessage('Address 1 must be at most 100 characters')
            .notEmpty().withMessage('Street Address is required')
            .isString().withMessage('Street Address must be a string'),

        body('address_2')
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

        body('zipcode')
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
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }

        const {
            full_name,
            address_1,
            address_2,
            city,
            state,
            zipcode,
            skills,
            preferences,
            availability
        } = req.body;

        if (!req.session || !req.session.user || !req.session.user.username) {
            console.error("User session or email are not valid.");
            return res.status(401).json({ message: 'Unauthorized: User session is invalid or expired' });
        }

        const userEmail = req.session.user.username;
        const userId = req.session.user.id;

        try {
            // Insert or update user profile
            await db.run(
                `INSERT INTO UserProfile (id, full_name, address_1, address_2, city, state, zipcode, skills, preferences,
                                          availability)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(id) DO
                UPDATE SET
                    full_name = excluded.full_name,
                    address_1 = excluded.address_1,
                    address_2 = excluded.address_2,
                    city = excluded.city,
                    state = excluded.state,
                    zipcode = excluded.zipcode,
                    skills = excluded.skills,
                    preferences = excluded.preferences,
                    availability = excluded.availability`,
                [
                    userId,
                    full_name,
                    address_1,
                    address_2,
                    city,
                    state,
                    zipcode,
                    JSON.stringify(skills),
                    preferences || '',
                    JSON.stringify(availability),
                ]
            );

            return res.status(200).json({ message: 'Profile updated successfully' });
        } catch (error) {
            console.error('Error updating profile:', error.message);
            return res.status(500).json({ message: 'Internal server error: Failed to update user profile' });
        }
    }
);

// Get all user info.
router.get('/', async (req, res) => {
    try {
        const rows = await promisify(db.all).bind(db)('SELECT * FROM UserProfile');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching all users:', error.message);
        res.status(500).json({ message: 'Internal server error: Failed to fetch user profiles' });
    }
});

// Get specific user's info.
router.get('/myProfile', async (req, res) => {
    const username = req.session?.user?.username;

    if (!username) {
        console.error("User session or username is not valid.");
        return res.status(401).json({ message: 'Unauthorized: User session or username is invalid' });
    }

    try {
        // Find the user ID from the UserCredentials table
        const query = 'SELECT id FROM UserCredentials WHERE username = ?';
        db.get(query, [username], (err, userRow) => {
            if (err) {
                console.error('Database error:', err.message);
                return res.status(500).json({ message: 'Internal server error: Failed to query UserCredentials' });
            }

            // Fetch the user profile using the found user ID
            const profileQuery = `SELECT * FROM UserProfile WHERE id = ?`;
            db.get(profileQuery, [userRow.id], (error, result) => {
                if (error) {
                    console.error('Database error:', error.message);
                    return res.status(500).json({ message: 'Internal server error: Failed to query UserProfile' });
                }
                if (!result) {
                    return res.status(404).json({ message: 'User profile not found' });
                }

                res.json(result);
            });
        });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ message: "Internal server error: Unexpected error occurred while fetching user profile" });
    }
});

module.exports = router;
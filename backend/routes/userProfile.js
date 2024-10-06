const express = require('express');
const { body, validationResult } = require('express-validator');

const router = express.Router();
const profiles = []; // In-memory storage for user profiles

// Create or Update User Profile
router.post(
  '/',
  [
    body('location').notEmpty().withMessage('Location is required').isString().withMessage('Location must be a string'),
    body('skills').isArray({ min: 1 }).withMessage('Skills must be an array with at least one skill'),
    body('preferences').optional().isArray().withMessage('Preferences must be an array'),
    body('availability').notEmpty().withMessage('Availability is required').isArray().withMessage('Availability must be an array'),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const newProfile = {
      id: profiles.length + 1,
      location: req.body.location,
      skills: req.body.skills,
      preferences: req.body.preferences || [],
      availability: req.body.availability,
    };

    profiles.push(newProfile);
    res.status(201).json(newProfile); // Created profile response
  }
);

// Get All Profiles
router.get('/', (req, res) => {
  res.json(profiles);
});

// Get Single Profile by ID
router.get('/:id', (req, res) => {
  const profile = profiles.find(p => p.id === parseInt(req.params.id));
  if (!profile) {
    return res.status(404).json({ message: 'Profile not found' });
  }
  res.json(profile);
});

module.exports = router;

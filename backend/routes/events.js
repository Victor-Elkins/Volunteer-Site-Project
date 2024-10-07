const express = require('express');
const { body, param, validationResult } = require('express-validator');
const router = express.Router();

// Hardcoded events array
let events = [
    {
        id: 1,
        name: 'Event One',
        Date: '10/10/2024',
        description: 'This is the first event.',
        location: 'New York',
        urgency: 'High',
        skills: ['JavaScript', 'React']
    },
    {
        id: 2,
        name: 'Event Two',
        Date: '10/15/2024',
        description: 'This is the second event.',
        location: 'Los Angeles',
        urgency: 'Medium',
        skills: ['Node.js', 'Express']
    },
    {
        id: 3,
        name: 'Event Three',
        Date: '10/20/2024',
        description: 'This is the third event.',
        location: 'Chicago',
        urgency: 'Low',
        skills: ['HTML', 'CSS']
    }
];

// POST route to create a new event
router.post(
  '/',
  [
    // Validate the required fields for creating an event
    body('name')
      .notEmpty().withMessage('Event name is required')
      .isString().withMessage('Event name must be a string')
      .isLength({ max: 100 }).withMessage('Event name cannot exceed 100 characters'),
    body('description')
      .notEmpty().withMessage('Event description is required')
      .isString().withMessage('Event description must be a string'),
    body('location')
      .notEmpty().withMessage('Location is required')
      .isString().withMessage('Location must be a string'),
    body('skills')
      .isArray({ min: 1 }).withMessage('At least one skill must be selected'),
    body('urgency')
      .notEmpty().withMessage('Urgency is required')
      .isString().withMessage('Urgency must be a string'),
    body('date')
      .notEmpty().withMessage('Event date is required')
      .isString().withMessage('Event date must be a string'),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const newEvent = {
      id: events.length + 1, // Auto-increment ID
      name: req.body.name,
      description: req.body.description,
      location: req.body.location,
      skills: req.body.skills,
      urgency: req.body.urgency,
      date: req.body.date,
    };
    
    events.push(newEvent);
    res.status(201).json(newEvent); 
  }
);

// DELETE route to remove an event by id
router.delete(
  '/:id',
  [
    param('id')
      .isInt({ gt: 0 }).withMessage('ID must be a positive integer'),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const id = parseInt(req.params.id);
    const eventIndex = events.findIndex(event => event.id === id);

    if (eventIndex === -1) {
      return res.status(404).json({ message: 'Event not found' });
    }

    events.splice(eventIndex, 1); 
    res.json({ message: 'Event removed' }); 
  }
);

module.exports = router;

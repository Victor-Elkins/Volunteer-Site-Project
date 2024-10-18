const express = require('express');
const { body, param, validationResult } = require('express-validator');
const router = express.Router();

// In-memory store for history events
const history = [
  { id: 1, event: 'Volunteer Recruitment', date: '2024-10-01', status: 'Completed' },
  { id: 2, event: 'Event Planning Meeting', date: '2024-10-05', status: 'Ongoing' },
  { id: 3, event: 'Fundraising Drive', date: '2024-10-10', status: 'Scheduled' },
  { id: 4, event: 'Community Service Day', date: '2024-10-15', status: 'Completed' },
  { id: 5, event: 'Feedback Session', date: '2024-10-18', status: 'Upcoming' },
];

// GET route to fetch all history events
router.get('/', (req, res) => {
  res.json(history);
});

// POST route to create a new history event
router.post(
  '/',
  [
    body('event').notEmpty().withMessage('Event field is required').isString().withMessage('Event must be a string'),
    body('date').notEmpty().withMessage('Date field is required').isString().withMessage('Date must be a string'),
    body('status').notEmpty().withMessage('Status field is required').isString().withMessage('Status must be a string'),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const newHistory = {
      id: history.length + 1, // Auto-increment ID
      event: req.body.event,
      date: req.body.date,
      status: req.body.status,
    };
    history.push(newHistory);
    res.status(201).json(newHistory); // Set status to 201 for created
  }
);

// DELETE route to remove a history event by ID
router.delete(
  '/:id',
  [
    param('id').isInt({ gt: 0 }).withMessage('ID must be a positive integer'),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const id = parseInt(req.params.id);
    const index = history.findIndex(item => item.id === id);
    if (index === -1) {
      return res.status(404).json({ message: 'History item not found' });
    }
    history.splice(index, 1);
    res.json({ message: 'History item removed' });
  }
);

module.exports = router;
const express = require('express');
const { body, param, validationResult } = require('express-validator');

const router = express.Router();
const history = []; // This is an in-memory store; consider using a database for production.

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

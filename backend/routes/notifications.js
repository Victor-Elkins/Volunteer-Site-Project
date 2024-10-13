const express = require('express');
const { body, param, validationResult } = require('express-validator');
const router = express.Router();

// In-memory storage for notifications
let notifications = [
  { id: 1, message: 'New event assignment' },
  { id: 2, message: 'Event has been updated' },
  { id: 3, message: 'Reminder about event' },
];

//TODO: This needs to get notifs from events not just default notifs
// Get all notifications
router.get('/', (req, res) => {
  res.json(notifications);
});


// Add a new notification with validation
router.post(
  '/',
  [
    // Validate 'message' field
    body('message').notEmpty().withMessage('Message is required').isString().withMessage('Message must be a string'),
  ],
  (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const newNotification = {
      id: notifications.length + 1, // Generate a new ID
      message: req.body.message,
    };
    notifications.push(newNotification);
    res.json(newNotification);
  }
);
router.get('/', (req, res) => {
  const notificationCount = notifications.length;
  res.json({ count: notificationCount, notifications: notifications });
});
// Remove a notification by id with validation
router.delete(
  '/:id',
  [
    // Validate 'id' parameter
    param('id').isInt({ gt: 0 }).withMessage('ID must be a positive integer'),
  ],
  (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const id = parseInt(req.params.id);
    notifications = notifications.filter(notification => notification.id !== id);
    res.json({ message: 'Notification removed' });
  }
);

module.exports = router;

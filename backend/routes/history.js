const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const db = require('../db');

// GET route to fetch all history events
router.get('/', (req, res) => {
  const user = req.session.user.id;
  console.log(user);
  console.log('GET /api/history - Accessing history route');

  const query = `
    SELECT 
      vh.id,
      ed.event_name AS event,
      vh.participation_date AS date,
      ed.description AS event_description, 
      ed.location AS event_location
    FROM VolunteerHistory vh
    JOIN EventDetails ed ON vh.event_id = ed.id
    WHERE vh.user_id = ? AND vh.session_active = 0
    ORDER BY vh.participation_date DESC
  `;

  console.log('Executing query to fetch all history entries');

  db.all(query, [user], (err, rows) => {
    if (err) {
      console.error('Database error in history GET:', err);
      return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
    console.log('Found history entries:', rows?.length || 0);
    res.json(rows);
  });
});

// Function to get a random event ID
const getRandomEventId = (callback) => {
  const query = `SELECT id FROM EventDetails ORDER BY RANDOM() LIMIT 1`;
  
  db.get(query, [], (err, row) => {
    if (err) {
      console.error('Error fetching random event ID:', err);
      return callback(err, null);
    }
    callback(null, row ? row.id : null); // Return the event ID or null
  });
};

// POST route to create a new history entry
router.post('/', [
  body('participation_date').isString().withMessage('Participation date is required'),
], (req, res) => {
  console.log('POST /api/history - Creating new history entry');
  console.log('Request body:', req.body);
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  getRandomEventId((err, eventId) => {
    if (err || !eventId) {
      return res.status(500).json({ message: 'Could not retrieve event ID', error: err ? err.message : 'No event found' });
    }

    const query = `
      INSERT INTO VolunteerHistory (user_id, event_id, participation_date)
      VALUES (?, ?, ?)
    `;

    console.log('Executing insert query with params:', {
      userId: req.session.user.id,
      eventId: eventId,
      date: req.body.participation_date
    });

    db.run(query, [
      req.session.user.id, // Assuming user ID is stored in session
      eventId,
      req.body.participation_date
    ], function(err) {
      if (err) {
        console.error('Database error in history POST:', err);
        return res.status(500).json({ message: 'Internal server error', error: err.message });
      }
      
      console.log('Successfully inserted history entry. ID:', this.lastID);
      
      const selectQuery = `
        SELECT 
          vh.id,
          ed.event_name as event,
          vh.participation_date as date,
          ed.description,
          ed.location
        FROM VolunteerHistory vh
        JOIN EventDetails ed ON vh.event_id = ed.id
        WHERE vh.id = ?
      `;

      db.get(selectQuery, [this.lastID], (err, row) => {
        if (err) {
          console.error('Database error in fetching new history entry:', err);
          return res.status(500).json({ message: 'Internal server error', error: err.message });
        }
        console.log('Returning new history entry:', row);
        res.status(201).json(row);
      });
    });
  });
});

module.exports = router;

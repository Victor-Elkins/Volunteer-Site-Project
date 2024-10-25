const express = require('express');
const router = express.Router();
const db = require('../db');

// GET route to fetch all upcoming notifications from the history table
router.get('/', (req, res) => {
  const user = req.session.user.id;
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  console.log(user);
  console.log('GET /api/notify - Accessing notifications route');

  const query = `
    SELECT 
      h.id,
      e.event_name AS event,
      h.date AS date,
      e.description,
      e.location
    FROM History h
    JOIN EventDetails e ON h.event_id = e.id
    WHERE h.user_id = ? AND h.date > CURRENT_TIMESTAMP
    ORDER BY h.date DESC
  `;

  console.log('Executing query to fetch notifications after current date');

  db.all(query, [user], (err, rows) => {
    if (err) {
      console.error('Database error in notifications GET:', err);
      return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
    console.log('Found notifications:', rows?.length || 0);
    res.json(rows);
  });
});

module.exports = router;

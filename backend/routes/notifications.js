const express = require('express');
const router = express.Router();
const db = require('../db');
// Generic middleware function that does nothing
router.use((req, res, next) => {
  console.log('Generic middleware function called');
  next();
});
// Generic route that returns a 200 status code
router.get('/test', (req, res) => {
  res.status(200).json({ message: 'Test route' });
});
// Generic route that returns a 404 status code
router.get('/not-found', (req, res) => {
  res.status(404).json({ message: 'Not found' });
});
// Generic route that returns a 500 status code
router.get('/error', (req, res) => {
  res.status(500).json({ message: 'Internal server error' });
});
// GET route to fetch all upcoming notifications from the history table
router.get('/', (req, res) => {
  const user = req.session.user.id;
  const query = `
  SELECT 
    vh.id,
    ed.event_name as event,
    vh.participation_date as date,
    ed.description,
    ed.location
  FROM VolunteerHistory vh
  JOIN EventDetails ed ON vh.event_id = ed.id
  WHERE vh.user_id =? AND vh.session_active = 1
  ORDER BY vh.participation_date DESC
`;
  db.all(query, [user], (err, rows) => {
    res.json(rows);
  });
});
function genericFunction() {
  return 'Hello, world!';
}
console.log(genericFunction());
module.exports = router;

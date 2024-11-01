const express = require('express');
const { body, param, validationResult } = require('express-validator');
const router = express.Router();
const db = require('../db'); 


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
      .isNumeric().withMessage('Urgency must be a number'),
    body('date')
      .notEmpty().withMessage('Event date is required')
      .isString().withMessage('Event date must be a string'),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const eventDate = new Date(req.body.date);
    const today = new Date();

    if (eventDate < today) {
      return res.status(400).json({ message: 'The event date cannot be in the past.' });
    }

    // Prepare data for insertion
    const { name, description, location, skills, urgency } = req.body;
    const skillsString = skills.join(','); // Convert skills array to a string

    // SQL query to insert a new event
    const insertQuery = `
      INSERT INTO EventDetails (event_name, description, location, required_skills, urgency, event_date)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    // Insert the new event into the database
    db.run(insertQuery, [name, description, location, skillsString, urgency, eventDate.toISOString()], function(err) {
      if (err) {
        console.error('Error inserting new event:', err.message);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      // Respond with the newly created event
      const newEvent = {
        id: this.lastID, // Get the ID of the newly inserted row
        name,
        description,
        location,
        skills,
        urgency,
        date: eventDate.toISOString().split('T')[0], // Format date as YYYY-MM-DD
      };

      res.status(201).json(newEvent);
    });
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
    const deleteQuery = `DELETE FROM EventDetails WHERE id = ?`;

    db.run(deleteQuery, [id], function (err) {
      if (err) {
        console.error('Error deleting event:', err.message);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      if (this.changes === 0) {
        return res.status(400).json({ message: 'Event not found' });
      }

      res.json({ message: 'Event removed' }); 

    });
  }
);


// Get route to return all events with assigned volunteers
router.get('/', (req, res) => {
  const query = `
    SELECT 
      e.id, 
      e.event_name AS name, 
      e.event_date AS date, 
      e.description, 
      e.location, 
      e.urgency, 
      e.required_skills AS skills,
      GROUP_CONCAT(vh.user_id) AS peopleAssigned  -- Change here to use user_id
    FROM EventDetails e
    LEFT JOIN VolunteerHistory vh ON e.id = vh.event_id
    GROUP BY e.id
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Error retrieving events:', err.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    
    // Map the rows to format required by your application
    const events = rows.map(row => ({
      id: row.id,
      name: row.name,
      date: new Date(row.date),
      description: row.description,
      location: row.location,
      urgency: row.urgency,
      skills: row.skills.split(','), // Convert string back to array
      peopleAssigned: row.peopleAssigned ? row.peopleAssigned.split(',').map(Number) : [] // Convert to array of IDs
    }));

    res.status(200).json(events);
  });
});

// PUT route to update an event by id
router.put(
  '/:id',
  [
    param('id').isInt({ gt: 0 }).withMessage('ID must be a positive integer'),
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

    const eventDate = new Date(req.body.date);
    const today = new Date();

    if (eventDate < today) {
      return res.status(400).json({ message: 'The event date cannot be in the past.' });
    }

    const eventId = parseInt(req.params.id);
    const { name, description, location, skills, urgency } = req.body;
    const skillsString = skills.join(','); 

    // SQL query to update an event by ID
    const updateQuery = `
      UPDATE EventDetails
      SET event_name = ?, description = ?, location = ?, required_skills = ?, urgency = ?, event_date = ?
      WHERE id = ?
    `;

    // Update the event in the database
    db.run(updateQuery, [name, description, location, skillsString, urgency, eventDate.toISOString(), eventId], function(err) {
      if (err) {
        console.error('Error updating event:', err.message);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ message: 'Event not found' });
      }

      const updatedEvent = {
        id: eventId,
        name,
        description,
        location,
        skills, 
        urgency,
        date: eventDate.toISOString().split('T')[0], // Format date as YYYY-MM-DD
      };

      res.status(200).json(updatedEvent);
    });
  }
);

module.exports = router;

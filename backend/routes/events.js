const express = require('express');
const { body, param, validationResult } = require('express-validator');
const router = express.Router();
const db = require('../db'); 

// Hardcoded events array (Should be replaced with database)
let events = [
    {
        id: 1,
        name: 'Event One',
        date: '10/10/2024',
        description: 'This is the first event.',
        location: 'New York',
        urgency: 'High',
        skills: ['Physically Fit'],
        peopleAssigned: ['John Doe', 'Jane Smith']
    },
    {
        id: 2,
        name: 'Event Two',
        date: '10/15/2024',
        description: 'This is the second event.',
        location: 'Los Angeles',
        urgency: 'Medium',
        skills: ['Problem-Solving'],
        peopleAssigned: ['Jane Smith', ]
    },
    {
        id: 3,
        name: 'Event Three',
        date: '10/20/2024',
        description: 'This is the third event.',
        location: 'Chicago',
        urgency: 'Low',
        skills: ['Marketing', 'Public Speaking'],
        peopleAssigned: ['Derrick Kidd']
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

    const eventDate = new Date(req.body.date);
    const today = new Date();

    if (eventDate < today) {
      return res.status(400).json({ message: 'The event date cannot be in the past.' });
    }

    // const newEvent = {
    //   id: events.length + 1, 
    //   name: req.body.name,
    //   description: req.body.description,
    //   location: req.body.location,
    //   skills: req.body.skills,
    //   urgency: req.body.urgency,
    //   date: req.body.date,
    // };
    
    // events.push(newEvent);

    // Prepare data for insertion
    const { name, description, location, skills, urgency } = req.body;
    const skillsString = skills.join(', '); // Convert skills array to a string

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
    // const eventIndex = events.findIndex(event => event.id === id);

    // if (eventIndex === -1) {
    //   return res.status(400).json({ message: 'Event not found' });
    // }

    // events.splice(eventIndex, 1); 

    // SQL query to delete the event by id
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

// PUT route to update people assigned to an event
router.put(
  '/:id/update-people',
  [
    param('id').isInt({ gt: 0 }).withMessage('ID must be a positive integer'),
    body('peopleAssigned').isArray().withMessage('peopleAssigned must be an array')
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const eventId = parseInt(req.params.id);
    const { peopleAssigned } = req.body;

    const event = events.find(event => event.id === eventId);
    if (!event) {
      return res.status(400).json({ message: 'Event not found.' });
    }
    event.peopleAssigned = peopleAssigned;

    res.status(200).json({ message: 'People assigned updated successfully', event });
  }
);

// // Get route to return all events
// router.get('/', (req, res) => {
//   res.status(200).json(events);
// });

// Get route to return all events
router.get('/', (req, res) => {
  const query = `SELECT id, event_name AS name, event_date AS date, description, location, urgency, required_skills AS skills FROM EventDetails`;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Error retrieving events:', err.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    
    // Map the rows to format required by your application
    const events = rows.map(row => ({
      id: row.id,
      name: row.name,
      date: new Date(row.date).toISOString().split('T')[0], 
      description: row.description,
      location: row.location,
      urgency: row.urgency,
      skills: row.skills.split(', ') // Convert string back to array
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

    // const updatedEvent = {
    //   ...events[eventIndex],
    //   ...req.body, 
    // };

    // events[eventIndex] = updatedEvent;

    const eventId = parseInt(req.params.id);
    const { name, description, location, skills, urgency } = req.body;
    const skillsString = skills.join(', '); 

    // SQL query to update an event by ID
    const updateQuery = `
      UPDATE EventDetails5
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

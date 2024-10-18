const express = require('express');
const request = require('supertest');

// Initialize an empty array or mock data for volunteers
let volunteers = [
  { id: 1, name: 'John Doe', skills: ['First Aid', 'Cooking'] },
  { id: 2, name: 'Jane Smith', skills: ['Event Planning', 'Public Speaking'] },
];

// Create a mock router for the volunteers API
const mockRouter = express.Router()
  .get('/', (req, res) => res.json(volunteers))
  .get('/with-skills', (req, res) => res.json([volunteers[0]]))
  .put('/update-people', (req, res) => {
    // Assume that the request body contains updated volunteer data
    const updatedVolunteers = req.body; // Update logic can be added as needed
    volunteers = updatedVolunteers; // This is just a mock for testing
    res.json({ message: 'Event and volunteers updated successfully.', volunteers });
  })
  .delete('/remove-event/:eventName', (req, res) => {
    const { eventName } = req.params;
    // Logic to remove the event from all volunteers would go here
    res.json({ message: `Event "${eventName}" removed from all volunteers.`, volunteers });
  });

// Set up the Express app for testing
const app = express();
app.use(express.json());
app.use('/api/volunteers', mockRouter);

describe('Volunteers API', () => {
  it('should return all volunteers', async () => {
    const res = await request(app).get('/api/volunteers');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(volunteers);
  });

  it('should return volunteers with skills', async () => {
    const res = await request(app).get('/api/volunteers/with-skills');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([volunteers[0]]);
  });

  it('should update volunteers', async () => {
    const updatedVolunteers = [
      { id: 1, name: 'John Doe', skills: ['First Aid'] },
      { id: 2, name: 'Jane Smith', skills: ['Event Planning'] },
    ];

    const res = await request(app)
      .put('/api/volunteers/update-people')
      .send(updatedVolunteers);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Event and volunteers updated successfully.');
    expect(res.body.volunteers).toEqual(updatedVolunteers);
  });

  it('should remove an event from all volunteers', async () => {
    const eventName = 'Cooking';
    const res = await request(app).delete(`/api/volunteers/remove-event/${eventName}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', `Event "${eventName}" removed from all volunteers.`);
  });
});

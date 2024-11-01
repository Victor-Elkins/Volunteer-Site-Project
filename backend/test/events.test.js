const express = require('express');
const request = require('supertest');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:'); // Use in-memory database
const eventsRouter = require('../routes/events');

const app = express();
app.use(express.json());

app.use('/events', eventsRouter); // Mount your router

// Mock database functions for testing
beforeAll((done) => {
  db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS EventDetails (id INTEGER PRIMARY KEY AUTOINCREMENT, event_name TEXT, description TEXT, location TEXT, required_skills TEXT, urgency INTEGER, event_date TEXT)");
    db.run("CREATE TABLE IF NOT EXISTS VolunteerHistory (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, event_id INTEGER)");
    done();
  });
});


afterAll(async () => {
  await db.close(); 
});

// Test cases
describe('Event API', () => {
  it('should create a new event', async () => {
    const response = await request(app)
      .post('/events')
      .send({
        name: 'Test Event',
        description: 'This is a test event.',
        location: 'Test Location',
        skills: ['skill1', 'skill2'],
        urgency: 2,
        date: '2024-12-31',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('Test Event');
  });

  it('should not create an event with invalid data', async () => {
    const response = await request(app)
      .post('/events')
      .send({
        name: '',
        description: 'This is a test event.',
        location: 'Test Location',
        skills: [],
        urgency: 'two',
        date: '2024-12-31',
      });

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });

  it('should not create an event with a past date', async () => {
    const response = await request(app)
      .post('/events')
      .send({
        name: 'Past Event',
        description: 'This event is in the past.',
        location: 'Past Location',
        skills: ['skill1'],
        urgency: 1,
        date: '2020-01-01', // Past date
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('The event date cannot be in the past.');
  });

  it('should retrieve all events', async () => {
    const response = await request(app).get('/events');
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
  });

  it('should update an event by id', async () => {
    const createResponse = await request(app)
      .post('/events')
      .send({
        name: 'Event to Update',
        description: 'Description of event to update.',
        location: 'Update Location',
        skills: ['skill1'],
        urgency: 1,
        date: '2024-12-31',
      });

    const eventId = createResponse.body.id;

    const updateResponse = await request(app)
      .put(`/events/${eventId}`)
      .send({
        name: 'Updated Event',
        description: 'Updated description.',
        location: 'Updated Location',
        skills: ['skill1', 'skill2'],
        urgency: 3,
        date: '2025-01-01',
      });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.name).toBe('Updated Event');
  });

  it('should not update an event with invalid data', async () => {
    const createResponse = await request(app)
      .post('/events')
      .send({
        name: 'Event to Update',
        description: 'Description of event to update.',
        location: 'Update Location',
        skills: ['skill1'],
        urgency: 1,
        date: '2024-12-31',
      });

    const eventId = createResponse.body.id;

    const updateResponse = await request(app)
      .put(`/events/${eventId}`)
      .send({
        name: '',
        description: 'Updated description.',
        location: 'Updated Location',
        skills: [],
        urgency: 'three',
        date: '2024-12-31',
      });

    expect(updateResponse.status).toBe(400);
    expect(updateResponse.body.errors).toBeDefined();
  });

  it('should delete an event by id', async () => {
    const createResponse = await request(app)
      .post('/events')
      .send({
        name: 'Event to Delete',
        description: 'This event will be deleted.',
        location: 'Delete Location',
        skills: ['skill1'],
        urgency: 1,
        date: '2024-12-31',
      });

    const eventId = createResponse.body.id;

    const deleteResponse = await request(app).delete(`/events/${eventId}`);
    
    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body.message).toBe('Event removed');
  });

  it('should return a 400 if the event to delete does not exist', async () => {
    const response = await request(app).delete('/events/99999');
    
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Event not found');
  });

  it('should return 404 if trying to update a non-existent event', async () => {
    const response = await request(app)
      .put('/events/99999')
      .send({
        name: 'Non-existent Event',
        description: 'This event does not exist.',
        location: 'Nowhere',
        skills: ['skill1'],
        urgency: 1,
        date: '2024-12-31',
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Event not found');
  });


  // Additional test case: Verify that an event cannot be created without required fields
  it('should not create an event without required fields', async () => {
    const response = await request(app)
      .post('/events')
      .send({}); // Sending an empty body

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });

  it('should not update an event with a non-numeric urgency', async () => {
    const createResponse = await request(app)
      .post('/events')
      .send({
        name: 'Event to Update',
        description: 'Description of event to update.',
        location: 'Update Location',
        skills: ['skill1'],
        urgency: 1,
        date: '2024-12-31',
      });
  
    const eventId = createResponse.body.id;
  
    const updateResponse = await request(app)
      .put(`/events/${eventId}`)
      .send({
        name: 'Updated Event',
        description: 'Updated description.',
        location: 'Updated Location',
        skills: ['skill1', 'skill2'],
        urgency: 'not-a-number', // Non-numeric urgency
        date: '2025-01-01',
      });
  
    expect(updateResponse.status).toBe(400);
    expect(updateResponse.body.errors).toBeDefined();
    expect(updateResponse.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          location: 'body',
          msg: 'Urgency must be a string', 
          path: 'urgency',
          type: 'field',
          value: 'not-a-number', 
        }),
      ])
    );
  });

});

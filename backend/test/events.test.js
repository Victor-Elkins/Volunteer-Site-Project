const express = require('express');
const request = require('supertest');
const db = require('../db'); 
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

afterAll((done) => {
  db.serialize(() => {
    db.run("DROP TABLE IF EXISTS EventDetails");
    db.run("DROP TABLE IF EXISTS VolunteerHistory");
    db.close();
    done();
  });
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

  it('should return a 404 if the event to delete does not exist', async () => {
    const response = await request(app).delete('/events/99999');
    
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Event not found');
  });
});
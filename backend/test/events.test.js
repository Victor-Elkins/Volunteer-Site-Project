const request = require('supertest');
const express = require('express');
const eventsRoutes = require('../routes/events'); // Adjust the path to your events router file

const app = express();
app.use(express.json());
app.use('/api/events', eventsRoutes); // Adjust the path to your events router

describe('Events Routes', () => {
    it('should return 400 for missing event name', async () => {
      const res = await request(app).post('/api/events').send({ 
        date: '2024-10-25', 
        description: 'Sample description', 
        location: 'Sample Location',
        urgency: 'Low',
        skills: ['Skill 1']
      });
      expect(res.statusCode).toEqual(400);
      expect(res.body.errors).toEqual(expect.arrayContaining([
        expect.objectContaining({ msg: 'Event name is required' }),
      ]));
    });
  
    it('should return 400 for missing date', async () => {
      const res = await request(app).post('/api/events').send({ 
        name: 'Sample Event', 
        description: 'Sample description', 
        location: 'Sample Location',
        urgency: 'Low',
        skills: ['Skill 1']
      });
      expect(res.statusCode).toEqual(400);
      expect(res.body.errors).toEqual(expect.arrayContaining([
        expect.objectContaining({ msg: 'Event date is required' }),
        expect.objectContaining({ msg: 'Event date must be a string' }),
      ]));
    });
  
    it('should return 400 for missing skills', async () => {
      const res = await request(app).post('/api/events').send({ 
        name: 'Sample Event', 
        date: '2024-10-25', 
        description: 'Sample description', 
        location: 'Sample Location',
        urgency: 'Low'
      });
      expect(res.statusCode).toEqual(400);
      expect(res.body.errors).toEqual(expect.arrayContaining([
        expect.objectContaining({ msg: 'At least one skill must be selected' }),
      ]));
    });
  
    it('should create a new event', async () => {
      const eventData = {
        name: 'New Event',
        date: '2024-10-25',
        description: 'Description for new event',
        location: 'Sample Location',
        urgency: 'Low',
        skills: ['Skill 1', 'Skill 2'],
      };
  
      const res = await request(app).post('/api/events').send(eventData);
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.name).toEqual(eventData.name);
    });
  
    it('should delete an event by ID', async () => {
      // First, create an event to delete
      const createRes = await request(app).post('/api/events').send({ 
        name: 'Event to Delete',
        date: '2024-10-25',
        description: 'This event will be deleted.',
        location: 'Delete Location',
        urgency: 'High',
        skills: ['Skill 1'],
      });
  
      const eventId = createRes.body.id; // Get the ID of the newly created event
  
      const res = await request(app).delete(`/api/events/${eventId}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'Event removed');
    });
  
    it('should return 404 for deleting a non-existent event', async () => {
      const res = await request(app).delete('/api/events/999');
      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('message', 'Event not found');
    });
  
    it('should return 400 for deleting with an invalid ID', async () => {
      const res = await request(app).delete('/api/events/invalidId');
      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toEqual(expect.arrayContaining([
        expect.objectContaining({ msg: 'ID must be a positive integer' }),
      ]));
    });
  });
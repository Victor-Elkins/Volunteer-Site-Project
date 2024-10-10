const request = require('supertest');
const express = require('express');
const eventsRoutes = require('../routes/events'); 

const app = express();
app.use(express.json());
app.use('/api/events', eventsRoutes); 

describe('Events Routes', () => {
    // Test for missing Input Validation (event name)
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
    
    // Test for missing Input Validation (date)
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
  
    // Test for missing Input Validation (skills)
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
  
    // Test for creating a new event
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
  
    // Test for deleting events
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
  
      const eventId = createRes.body.id; 
  
      const res = await request(app).delete(`/api/events/${eventId}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'Event removed');
    });
  
    // Test for deleting a non-existent event
    it('should return 404 for deleting a non-existent event', async () => {
      const res = await request(app).delete('/api/events/999');
      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('message', 'Event not found');
    });

    // Test for deleting without valid ID
    it('should return 400 for deleting with an invalid ID', async () => {
      const res = await request(app).delete('/api/events/invalidId');
      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toEqual(expect.arrayContaining([
        expect.objectContaining({ msg: 'ID must be a positive integer' }),
      ]));
    });
    
    // Test for updating events (updating people assignmed)
    it('should update people assigned to an event', async () => {
      const createRes = await request(app).post('/api/events').send({
        name: 'Event with People',
        date: '2024-10-25',
        description: 'This event will have people assigned.',
        location: 'Sample Location',
        urgency: 'Medium',
        skills: ['Skill 1'],
      });

      const eventId = createRes.body.id; 

      const updateRes = await request(app).put(`/api/events/${eventId}/update-people`).send({
        peopleAssigned: ['John Doe', 'Jane Smith'],
      });

      expect(updateRes.statusCode).toEqual(200);
      expect(updateRes.body.event.peopleAssigned).toEqual(['John Doe', 'Jane Smith']);
      expect(updateRes.body).toHaveProperty('message', 'People assigned updated successfully');
    });

    // Test for updating an invalid ID
    it('should return 400 for invalid event ID while updating people assigned', async () => {
      const res = await request(app).put('/api/events/invalidId/update-people').send({
        peopleAssigned: ['John Doe'],
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body.errors).toEqual(expect.arrayContaining([
        expect.objectContaining({ msg: 'ID must be a positive integer' }),
      ]));
    });

    // Test for updating an non-existent event
    it('should return 404 for updating people assigned to a non-existent event', async () => {
      const res = await request(app).put('/api/events/999/update-people').send({
        peopleAssigned: ['John Doe'],
      });

      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('message', 'Event not found.');
    });
});
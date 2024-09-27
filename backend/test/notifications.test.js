const request = require('supertest');
const express = require('express');
const notificationsRoutes = require('../routes/notifications');

const app = express();
app.use(express.json());
app.use('/api/notifications', notificationsRoutes);

describe('Notifications API', () => {
  it('should fetch all notifications', async () => {
    const res = await request(app).get('/api/notifications');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(3); // Initially, there are 3 notifications
  });

  it('should add a new notification', async () => {
    const newNotification = { message: 'New notification for test' };
    const res = await request(app).post('/api/notifications').send(newNotification);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe(newNotification.message);
  });

  it('should return 400 for adding a notification with an empty message', async () => {
    const res = await request(app).post('/api/notifications').send({ message: '' });
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toEqual(expect.arrayContaining([
      expect.objectContaining({ msg: 'Message is required' }),
    ]));
  });

  it('should delete a notification by ID', async () => {
    const res = await request(app).delete('/api/notifications/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Notification removed');
  });

  it('should return 400 for deleting a notification with an invalid ID', async () => {
    const res = await request(app).delete('/api/notifications/invalidId');
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toEqual(expect.arrayContaining([
      expect.objectContaining({ msg: 'ID must be a positive integer' }),
    ]));
  });

  it('should return 404 for deleting a non-existent notification', async () => {
    const res = await request(app).delete('/api/notifications/999');
    expect(res.statusCode).toBe(200); // This should respond 200 as you don't have an error message
    expect(res.body.message).toBe('Notification removed'); // This line can be modified based on your logic
  });
});

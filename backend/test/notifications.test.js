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

  it('should delete a notification by ID', async () => {
    const res = await request(app).delete('/api/notifications/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Notification removed');
  });
});

const request = require('supertest');
const express = require('express');
const userProfileRoutes = require('../routes/userProfile'); // Adjust path if necessary

const app = express();
app.use(express.json());
app.use('/api/userProfile', userProfileRoutes);

describe('User Profile Routes', () => {
  it('should return 400 for missing location field', async () => {
    const res = await request(app).post('/api/userProfile').send({
      skills: ['Teaching'],
      availability: ['Monday'],
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body.errors).toEqual(expect.arrayContaining([
      expect.objectContaining({ msg: 'Location is required' }),
    ]));
  });

  it('should return 400 for invalid skills type', async () => {
    const res = await request(app).post('/api/userProfile').send({
      location: 'New York',
      skills: 'Teaching',
      availability: ['Monday'],
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body.errors).toEqual(expect.arrayContaining([
      expect.objectContaining({ msg: 'Skills must be an array with at least one skill' }),
    ]));
  });

  it('should create a user profile successfully', async () => {
    const res = await request(app).post('/api/userProfile').send({
      location: 'New York',
      skills: ['Teaching'],
      availability: ['Monday'],
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('location', 'New York');
  });

  it('should get all profiles', async () => {
    const res = await request(app).get('/api/userProfile');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it('should return 404 for non-existent profile', async () => {
    const res = await request(app).get('/api/userProfile/999');
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('message', 'Profile not found');
  });
});

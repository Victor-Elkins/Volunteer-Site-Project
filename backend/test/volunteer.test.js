const request = require('supertest');
const express = require('express');
const volunteerRoutes = require('../routes/volunteer'); 

const app = express();
app.use(express.json());
app.use('/api/volunteer', volunteerRoutes);

describe('Volunteer Matching API', () => {
  it('should return all volunteers', async () => {
    const res = await request(app).get('/api/volunteer');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 1, name: 'Joe Ng' }),
      expect.objectContaining({ id: 2, name: 'Larry Bird' }),
      expect.objectContaining({ id: 3, name: 'Kenn Kerr' }),
    ]));
  });
});
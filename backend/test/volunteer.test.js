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

  it('should return volunteers with matching skills', async () => {
    const res = await request(app)
      .get('/api/volunteer/with-skills')
      .query({ skills: 'Physically Fit, Good with Childern' }); // Example query

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 1, name: 'Joe Ng' }), // Joe has 'Physically Fit' and 'Good with Childern'
    ]));
    expect(res.body).not.toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 2, name: 'Larry Bird' }),
      expect.objectContaining({ id: 3, name: 'Kenn Kerr' }),
    ]));
  });

  it('should return an empty array when no volunteers match the required skills', async () => {
    const res = await request(app)
      .get('/api/volunteer/with-skills')
      .query({ skills: 'Nonexistent Skill' }); // A skill that no volunteers have

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([]);
  });
});
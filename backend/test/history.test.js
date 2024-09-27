const request = require('supertest');
const express = require('express');
const historyRoutes = require('../routes/history'); // Adjust the path as necessary

const app = express();
app.use(express.json());
app.use('/api/history', historyRoutes);

describe('History Routes', () => {
  it('should return 400 for missing event field', async () => {
    const res = await request(app).post('/api/history').send({ date: '2024-09-01', status: 'Completed' });
    expect(res.statusCode).toEqual(400);
    expect(res.body.errors).toEqual(expect.arrayContaining([
      expect.objectContaining({ msg: 'Event field is required' }),
    ]));
  });

  it('should return 400 for missing date field', async () => {
    const res = await request(app).post('/api/history').send({ event: 'Sample Event', status: 'Completed' });
    expect(res.statusCode).toEqual(400);
    expect(res.body.errors).toEqual(expect.arrayContaining([
      expect.objectContaining({ msg: 'Date field is required' }),
    ]));
  });

  it('should return 400 for missing status field', async () => {
    const res = await request(app).post('/api/history').send({ event: 'Sample Event', date: '2024-09-01' });
    expect(res.statusCode).toEqual(400);
    expect(res.body.errors).toEqual(expect.arrayContaining([
      expect.objectContaining({ msg: 'Status field is required' }),
    ]));
  });

  it('should delete a history item by ID', async () => {
    // First, create an item to delete
    await request(app).post('/api/history').send({ event: 'Sample Event', date: '2024-09-01', status: 'Completed' });

    const res = await request(app).delete('/api/history/1');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'History item removed');
  });

  it('should return 404 for deleting a non-existent history item', async () => {
    const res = await request(app).delete('/api/history/999');
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('message', 'History item not found');
  });

  it('should return 400 for deleting with an invalid ID', async () => {
    const res = await request(app).delete('/api/history/invalidId');
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toEqual(expect.arrayContaining([
      expect.objectContaining({ msg: 'ID must be a positive integer' }),
    ]));
  });
});

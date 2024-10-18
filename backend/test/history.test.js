const request = require('supertest');
const express = require('express');
const historyRoutes = require('../routes/history'); // Adjust the path as necessary

const app = express();
app.use(express.json());
app.use('/api/history', historyRoutes);

describe('History Routes', () => {
  // Reset in-memory history before each test
  beforeEach(() => {
    // Reset the history array to ensure tests are independent
    historyRoutes.history = []; // Reset the in-memory store
  });

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

  it('should create a new history item', async () => {
    const res = await request(app).post('/api/history').send({ event: 'Sample Event', date: '2024-09-01', status: 'Completed' });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.event).toEqual('Sample Event');
    expect(res.body.date).toEqual('2024-09-01');
    expect(res.body.status).toEqual('Completed');
  });

  it('should delete a history item by ID', async () => {
    // First, create an item to delete
    const createRes = await request(app).post('/api/history').send({ event: 'Sample Event', date: '2024-09-01', status: 'Completed' });
    const itemId = createRes.body.id;

    const res = await request(app).delete(`/api/history/${itemId}`);
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

  // New test case to verify fetching all history events
  it('should return all history events', async () => {
    // Mock the history array directly with actual items
    const mockHistory = [
      { id: 1, event: 'Volunteer Recruitment', date: '2024-10-01', status: 'Completed' },
      { id: 2, event: 'Event Planning Meeting', date: '2024-10-05', status: 'Ongoing' },
      { id: 3, event: 'Fundraising Drive', date: '2024-10-10', status: 'Scheduled' },
      { id: 4, event: 'Community Service Day', date: '2024-10-15', status: 'Completed' },
      { id: 5, event: 'Feedback Session', date: '2024-10-18', status: 'Upcoming' },
      { id: 6, event: 'Sample Event', date: '2024-09-01', status: 'Completed' }, // Add any additional items as needed
    ];

    // Override the in-memory history for the duration of this test
    historyRoutes.history = mockHistory;

    const res = await request(app).get('/api/history');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveLength(mockHistory.length); // Expecting the same length as the mock
    expect(res.body).toEqual(expect.arrayContaining(mockHistory.map(item => 
      expect.objectContaining(item)
    )));
  });
});

const request = require('supertest');
const express = require('express');
const historyRoutes = require('../routes/history'); // Adjust the path as necessary
const db = require('../db'); // Ensure you import the db

jest.mock('../db'); // Mock the db module

const app = express();
app.use(express.json());
app.use('/api/history', historyRoutes);

describe('History Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock history before each test
  });

  it('should return 400 for missing event_id field', async () => {
    const res = await request(app).post('/api/history').send({ participation_date: '2024-09-01' });
    expect(res.statusCode).toEqual(400);
    expect(res.body.errors).toEqual(expect.arrayContaining([
      expect.objectContaining({ msg: 'Valid event ID is required' }),
    ]));
  });

  it('should return 400 for missing participation_date field', async () => {
    const res = await request(app).post('/api/history').send({ event_id: 1 });
    expect(res.statusCode).toEqual(400);
    expect(res.body.errors).toEqual(expect.arrayContaining([
      expect.objectContaining({ msg: 'Participation date is required' }),
    ]));
  });

  it('should create a new history item', async () => {
    // Mock db.run to simulate successful insertion
    const mockLastID = 1;
    db.run.mockImplementation((query, params, callback) => {
      callback(null); // Simulate success
    });

    db.get.mockImplementation((query, params, callback) => {
      const row = { id: mockLastID, event_name: 'Sample Event', participation_date: '2024-09-01', description: 'Description', location: 'Location' };
      callback(null, row); // Simulate fetching the inserted entry
    });

    const res = await request(app).post('/api/history').send({ event_id: 1, participation_date: '2024-09-01' });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id', mockLastID);
    expect(res.body.event).toEqual('Sample Event');
    expect(res.body.date).toEqual('2024-09-01');
  });

  it('should return 500 on database error during creation', async () => {
    db.run.mockImplementation((query, params, callback) => {
      callback(new Error('Database error')); // Simulate database error
    });

    const res = await request(app).post('/api/history').send({ event_id: 1, participation_date: '2024-09-01' });
    expect(res.statusCode).toEqual(500);
    expect(res.body).toHaveProperty('message', 'Internal server error');
  });

  it('should return all history events', async () => {
    const mockHistory = [
      { id: 1, event_name: 'Volunteer Recruitment', participation_date: '2024-10-01', description: 'Recruiting volunteers', location: 'Community Center' },
      { id: 2, event_name: 'Event Planning Meeting', participation_date: '2024-10-05', description: 'Planning for upcoming events', location: 'Library' },
    ];

    // Mock the db.all method to return mockHistory
    db.all.mockImplementation((query, params, callback) => {
      callback(null, mockHistory); // Simulate success
    });

    const res = await request(app).get('/api/history');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(mockHistory);
  });

  it('should return 500 on database error when fetching history events', async () => {
    db.all.mockImplementation((query, params, callback) => {
      callback(new Error('Database error')); // Simulate database error
    });

    const res = await request(app).get('/api/history');
    expect(res.statusCode).toEqual(500);
    expect(res.body).toHaveProperty('message', 'Internal server error');
  });
});

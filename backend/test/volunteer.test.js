const request = require('supertest');
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const volunteerRoutes = require('../routes/volunteer');
const db = new sqlite3.Database(':memory:');

const app = express();
app.use(express.json());

app.use('/volunteer', volunteerRoutes); // Mount your router

// Set up the database before all tests
beforeAll((done) => {
    db.serialize(() => {
        // Create tables
        db.run(`CREATE TABLE UserProfile (
            id INTEGER PRIMARY KEY,
            full_name TEXT NOT NULL,
            skills TEXT NOT NULL
        )`);

        db.run(`CREATE TABLE EventDetails (
            id INTEGER PRIMARY KEY,
            event_name TEXT NOT NULL
        )`);

        db.run(`CREATE TABLE VolunteerHistory (
            id INTEGER PRIMARY KEY,
            user_id INTEGER,
            event_id INTEGER,
            participation_date TEXT,
            session_active INTEGER,
            FOREIGN KEY (user_id) REFERENCES UserProfile (id),
            FOREIGN KEY (event_id) REFERENCES EventDetails (id)
        )`);

        // Seed initial data
        db.run(`INSERT INTO UserProfile (full_name, skills) VALUES 
            ('John Doe', 'Physically Fit,Good with Children'),
            ('Jane Smith', 'Problem-Solving,Health Skills,Physically Fit'),
            ('Steven Lang', 'Team Leadership,Data Analysis,Marketing,Physically Fit'),
            ('Brandon James', 'Public Speaking,Fundraising'),
            ('Emily Lee', 'Fundraising,Public Speaking,Problem-Solving'),
            ('Derrick Kidd', 'Marketing,Organizational skills,Public Speaking')`);

        db.run(`INSERT INTO EventDetails (event_name) VALUES 
            ('Event One'),
            ('Event Two'),
            ('Event Three')`);

        db.run(`INSERT INTO VolunteerHistory (user_id, event_id, participation_date, session_active) VALUES 
            (1, 1, '2024-01-01', 1),
            (2, 1, '2024-01-01', 1),
            (2, 2, '2024-01-01', 1),
            (6, 3, '2024-01-01', 1)`, () => {
                // Use the mock database for the volunteer routes
                app.use('/api/volunteers', volunteerRoutes(db)); // Pass the mock database to routes
                done();
            });
    });
});

// Clean up the database after all tests
afterAll((done) => {
    db.close(done);
});

// Test GET all volunteers
describe('GET /api/volunteers', () => {
    it('should return all volunteers with their assigned events', async () => {
        const response = await request(app).get('/api/volunteers');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(expect.arrayContaining([
            expect.objectContaining({ name: 'John Doe', EventAssigned: ['Event One'] }),
            expect.objectContaining({ name: 'Jane Smith', EventAssigned: ['Event One', 'Event Two'] }),
            expect.objectContaining({ name: 'Steven Lang', EventAssigned: [] }),
            expect.objectContaining({ name: 'Brandon James', EventAssigned: [] }),
            expect.objectContaining({ name: 'Emily Lee', EventAssigned: [] }),
            expect.objectContaining({ name: 'Derrick Kidd', EventAssigned: ['Event Three'] }),
        ]));
    });
});

// Test GET volunteers with required skills
describe('GET /api/volunteers/with-skills', () => {
    it('should return volunteers with the specified skills not assigned to the specified event', async () => {
        const response = await request(app)
            .get('/api/volunteers/with-skills?skills=Physically Fit&eventName=Event Two');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(expect.arrayContaining([
            expect.objectContaining({ name: 'John Doe' }),
            expect.objectContaining({ name: 'Steven Lang' }),
        ]));
    });

    it('should return a 400 error if event name or skills are not provided', async () => {
        const response = await request(app).get('/api/volunteers/with-skills?skills=');
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: 'Event name and required skills are required.' });
    });
});

// Test PUT update volunteer assignments
describe('PUT /api/volunteers/update-people', () => {
    it('should update the volunteers assigned to an event', async () => {
        const response = await request(app).put('/api/volunteers/update-people').send({
            eventId: 1,
            peopleAssigned: [3, 4],
            eventDate: '2024-01-01',
            peopleToDelete: [1]
        });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: 'Event and volunteers updated successfully.' });
    });

    it('should return a 400 error if peopleAssigned or peopleToDelete are not arrays', async () => {
        const response = await request(app).put('/api/volunteers/update-people').send({
            eventId: 1,
            peopleAssigned: 'not an array',
            eventDate: '2024-01-01',
            peopleToDelete: []
        });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: 'peopleAssigned and peopleToDelete must be arrays' });
    });
});

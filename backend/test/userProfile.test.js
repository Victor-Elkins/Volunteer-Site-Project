const request = require('supertest');
const express = require('express');
const userProfileRoutes = require('../routes/userProfile');
const session = require("express-session");
const authRoutes = require('../routes/auth'); // Ensure you include the auth routes for testing login

const app = express();
app.use(express.json());

// Move the session middleware before the routes
app.use(session({
    secret: '00d4287e129abc006ad2be920d733c2e',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 1000 * 60 * 60 } // 1-hour session lifetime
}));

// Include auth routes for testing login
app.use('/api/auth', authRoutes);
app.use('/api/userProfile', userProfileRoutes);

// Mock the in-memory users store
const users = require('../users');

describe('User Profile Routes', () => {
    let server;
    let agent = request.agent(app);
    const PORT = process.env.PORT || 5000;

    beforeEach(async () => {
        server = app.listen(PORT);
        users.length = 0; // Clear users before each test

        // Register a user
        await agent
            .post('/api/auth/register')
            .send({ email: 'testuser@example.com', password: 'password123' });

        // Login to create a session
        await agent
            .post('/api/auth/login')
            .send({ email: 'testuser@example.com', password: 'password123' });
    });

    afterEach(async () => {
        await server.close();
    });

    it('should return 400 for missing full name', async () => {
        const res = await agent.post('/api/userProfile').send({
            streetAddress: '123 Main St',
            city: 'Paradise',
            state: 'CA',
            postalCode: '12345',
            skills: ['Teaching'],
            availability: ['2024-10-17T05:00:00.000Z'],
        });
        expect(res.statusCode).toEqual(400);
        expect(res.body.errors).toEqual(expect.arrayContaining([
            expect.objectContaining({ msg: 'Full Name is required' }),
        ]));
    });

    it('should return 400 for full name not being a string', async () => {
        const res = await agent.post('/api/userProfile').send({
            fullName: 123,
            streetAddress: '123 Main St',
            city: 'Paradise',
            state: 'CA',
            postalCode: '12345',
            skills: ['Teaching'],
            availability: ['2024-10-17T05:00:00.000Z'],
        });
        expect(res.statusCode).toEqual(400);
        expect(res.body.errors).toEqual(expect.arrayContaining([
            expect.objectContaining({ msg: 'Full Name must be a string' }),
        ]));
    });

    // ... (other test cases follow the same pattern)

    it('should update a user profile successfully', async () => {
        const res = await agent
            .post('/api/userProfile')
            .send({
                fullName: 'Jane Doe',
                streetAddress: '123 Main St',
                city: 'Paradise',
                state: 'CA',
                postalCode: '12345',
                skills: ['Teaching'],
                availability: ['2024-10-17T05:00:00.000Z'],
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('fullName', 'Jane Doe');
        expect(res.body).toHaveProperty('streetAddress', '123 Main St');
        expect(res.body).toHaveProperty('city', 'Paradise');
        expect(res.body).toHaveProperty('state', 'CA');
        expect(res.body).toHaveProperty('postalCode', '12345');
        expect(res.body.skills).toContain('Teaching');
        expect(res.body.availability).toContain('2024-10-17T05:00:00.000Z');
    });

    it('should get all profiles', async () => {
        const res = await agent.get('/api/userProfile');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
    });

    it('should return 404 for non-existent profile', async () => {
        const res = await agent.get('/api/userProfile/999');
        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty('message', 'Profile not found');
    });
});

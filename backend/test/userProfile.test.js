const request = require('supertest');
const express = require('express');
const userProfileRoutes = require('../routes/userProfile');
const session = require("express-session");
const authRoutes = require('../routes/auth');

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

describe('User Profile Routes', () => {
    let server;
    let agent = request.agent(app);
    const PORT = process.env.PORT || 5000;

    beforeEach(async () => {
        server = app.listen(PORT);

        // Login to create a session
        const login_response = await agent
            .post('/api/auth/login')
            .send({ username: 'testuser@example.com', password: 'password123' });

        console.log('Session after login:', agent.session);

        await agent
            .post('/api/userProfile')
            .send({
                full_name: 'Jane Doe',
                address_1: '123 Main St',
                address_2: '',
                city: 'Anytown',
                state: 'CA',
                zipcode: '90210',
                skills: ['JavaScript', 'Node.js'],
                preferences: 'None',
                availability: ['2024-10-17'],
            });
    });

    afterEach(async () => {
        await server.close();
    });

    it('should return 400 for missing full name', async () => {
        const res = await agent.post('/api/userProfile').send({
            address_1: '123 Main St',
            city: 'Paradise',
            state: 'CA',
            zipcode: '12345',
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
            full_name: 123,
            address_1: '123 Main St',
            city: 'Paradise',
            state: 'CA',
            zipcode: '12345',
            skills: ['Teaching'],
            availability: ['2024-10-17T05:00:00.000Z'],
        });
        expect(res.statusCode).toEqual(400);
        expect(res.body.errors).toEqual(expect.arrayContaining([
            expect.objectContaining({ msg: 'Full Name must be a string' }),
        ]));
    });

    it('should return 400 for missing street address', async () => {
        const res = await agent.post('/api/userProfile').send({
            full_name: 'Jane Doe',
            city: 'Paradise',
            state: 'CA',
            zipcode: '12345',
            skills: ['Teaching'],
            availability: ['2024-10-17T05:00:00.000Z'],
        });
        expect(res.statusCode).toEqual(400);
        expect(res.body.errors).toEqual(expect.arrayContaining([
            expect.objectContaining({ msg: 'Street Address is required' }),
        ]));
    });

    it('should return 400 for street address not being a string', async () => {
        const res = await agent.post('/api/userProfile').send({
            full_name: 'Jane Doe',
            address_1: 123,
            city: 'Paradise',
            state: 'CA',
            zipcode: '12345',
            skills: ['Teaching'],
            availability: ['2024-10-17T05:00:00.000Z'],
        });
        expect(res.statusCode).toEqual(400);
        expect(res.body.errors).toEqual(expect.arrayContaining([
            expect.objectContaining({ msg: 'Street Address must be a string' }),
        ]));
    });

    it('should return 400 for city missing', async () => {
        const res = await agent.post('/api/userProfile').send({
            full_name: 'Jane Doe',
            address_1: '123 Main St',
            state: 'CA',
            zipcode: '12345',
            skills: ['Teaching'],
            availability: ['2024-10-17T05:00:00.000Z'],
        });
        expect(res.statusCode).toEqual(400);
        expect(res.body.errors).toEqual(expect.arrayContaining([
            expect.objectContaining({ msg: 'City is required' }),
        ]));
    });

    it('should return 400 for city not being a string', async () => {
        const res = await agent.post('/api/userProfile').send({
            full_name: 'Jane Doe',
            address_1: '123 Main St',
            city: 123,
            state: 'CA',
            zipcode: '12345',
            skills: ['Teaching'],
            availability: ['2024-10-17T05:00:00.000Z'],
        });
        expect(res.statusCode).toEqual(400);
        expect(res.body.errors).toEqual(expect.arrayContaining([
            expect.objectContaining({ msg: 'City must be a string' }),
        ]));
    });

    it('should return 400 for postal code missing', async () => {
        const res = await agent.post('/api/userProfile').send({
            full_name: 'Jane Doe',
            address_1: '123 Main St',
            city: 'Paradise',
            state: 'CA',
            skills: ['Teaching'],
            availability: ['2024-10-17T05:00:00.000Z'],
        });
        expect(res.statusCode).toEqual(400);
        expect(res.body.errors).toEqual(expect.arrayContaining([
            expect.objectContaining({ msg: 'Zip Code is required' }),
        ]));
    });

    it('should return 400 for postal code not being between 5-9 characters', async () => {
        const res = await agent.post('/api/userProfile').send({
            full_name: 'Jane Doe',
            address_1: '123 Main St',
            city: 'Paradise',
            state: 'CA',
            zipcode: '1234', // Invalid postal code
            skills: ['Teaching'],
            availability: ['2024-10-17T05:00:00.000Z'],
        });
        expect(res.statusCode).toEqual(400);
        expect(res.body.errors).toEqual(expect.arrayContaining([
            expect.objectContaining({ msg: 'Zip Code must be between 5 and 9 characters' }),
        ]));
    });

    it('should return 400 for state missing', async () => {
        const res = await agent.post('/api/userProfile').send({
            full_name: 'Jane Doe',
            address_1: '123 Main St',
            city: 'Paradise',
            zipcode: '12345',
            skills: ['Teaching'],
            availability: ['2024-10-17T05:00:00.000Z'],
        });
        expect(res.statusCode).toEqual(400);
        expect(res.body.errors).toEqual(expect.arrayContaining([
            expect.objectContaining({ msg: 'State is required' }),
        ]));
    });

    it('should return 400 for state not being a 2-character string', async () => {
        const res = await agent.post('/api/userProfile').send({
            full_name: 'Jane Doe',
            address_1: '123 Main St',
            city: 'Paradise',
            state: 'California',
            zipcode: '12345',
            skills: ['Teaching'],
            availability: ['2024-10-17T05:00:00.000Z'],
        });
        expect(res.statusCode).toEqual(400);
        expect(res.body.errors).toEqual(expect.arrayContaining([
            expect.objectContaining({ msg: 'State code must be exactly 2 characters' }),
        ]));
    });

    it('should return 400 for skills not having at least one skill', async () => {
        const res = await agent.post('/api/userProfile').send({
            full_name: 'Jane Doe',
            address_1: '123 Main St',
            city: 'Paradise',
            state: 'CA',
            zipcode: '12345',
            skills: [], // No skills provided
            availability: ['2024-10-17T05:00:00.000Z'],
        });
        expect(res.statusCode).toEqual(400);
        expect(res.body.errors).toEqual(expect.arrayContaining([
            expect.objectContaining({ msg: 'Skills must be an array with at least one skill' }),
        ]));
    });

    it('should return 400 for availability not having at least one date', async () => {
        const res = await agent.post('/api/userProfile').send({
            full_name: 'Jane Doe',
            address_1: '123 Main St',
            city: 'Paradise',
            state: 'CA',
            zipcode: '12345',
            skills: ['Teaching'],
            availability: [], // No availability dates provided
        });
        expect(res.statusCode).toEqual(400);
        expect(res.body.errors).toEqual(expect.arrayContaining([
            expect.objectContaining({ msg: 'Availability must be an array with at least one date' }),
        ]));
    });

    it('should return 400 for preferences not being a string', async () => {
        const res = await agent.post('/api/userProfile').send({
            full_name: 'Jane Doe',
            address_1: '123 Main St',
            city: 'Paradise',
            state: 'CA',
            zipcode: '12345',
            skills: ['Teaching'],
            availability: ['2024-10-17T05:00:00.000Z'],
            preferences: 123,
        });
        expect(res.statusCode).toEqual(400);
        expect(res.body.errors).toEqual(expect.arrayContaining([
            expect.objectContaining({ msg: 'Preferences must be a string' }),
        ]));
    });

    it('should update a user profile successfully', async () => {
        const res = await agent
            .post('/api/userProfile')
            .send({
                full_name: 'Jane Doe',
                address_1: '123 Main St',
                city: 'Paradise',
                state: 'CA',
                zipcode: '12345',
                skills: ['Teaching'],
                availability: ['2024-10-17T05:00:00.000Z'],
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Profile updated successfully');
    });

    it('should return 404 for user not found', async () => {
        // Mock a valid user ID that does not exist in UserCredentials
        agent = request.agent(app); // Re-initialize the agent for a new session
        await agent
            .post('/api/auth/login')
            .send({ email: 'testuser@example.com', password: 'password123' });

        // Manually set a user ID that does not correspond to any user in the database
        agent.session.user = { id: 'nonexistent-user-id' };

        const res = await agent
            .post('/api/userProfile')
            .send({
                full_name: 'Jane Doe',
                address_1: '123 Main St',
                city: 'Paradise',
                state: 'CA',
                zipcode: '12345',
                skills: ['Teaching'],
                availability: ['2024-10-17T05:00:00.000Z'],
            });

        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty('message', 'User not found');
    });


    it('should return the user profile when a valid session is provided', async () => {
        const res = await agent.get('/api/userProfile/myProfile');

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('full_name', 'Jane Doe');
        expect(res.body).toHaveProperty('address_1', '123 Main St');
    });


});

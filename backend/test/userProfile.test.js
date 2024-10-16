const request = require('supertest');
const express = require('express');
const userProfileRoutes = require('../routes/userProfile'); // Adjust path if necessary

const app = express();
app.use(express.json());
app.use('/api/userProfile', userProfileRoutes);

describe('User Profile Routes', () => {
    let server;
    const PORT = process.env.PORT || 5000;

    beforeAll(async () => {
        server = app.listen(PORT);
    });

    afterAll(async () => {
        await server.close();
    });

    it('should return 400 for missing full name', async () => {
        const res = await request(app).post('/api/userProfile').send({
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
        const res = await request(app).post('/api/userProfile').send({
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

    it('should return 400 for missing street address', async () => {
        const res = await request(app).post('/api/userProfile').send({
            fullName: 'Jane Doe',
            city: 'Paradise',
            state: 'CA',
            postalCode: '12345',
            skills: ['Teaching'],
            availability: ['2024-10-17T05:00:00.000Z'],
        });
        expect(res.statusCode).toEqual(400);
        expect(res.body.errors).toEqual(expect.arrayContaining([
            expect.objectContaining({ msg: 'Street Address is required' }),
        ]));
    });

    it('should return 400 for street address not being a string', async () => {
        const res = await request(app).post('/api/userProfile').send({
            fullName: 'Jane Doe',
            streetAddress: 123,
            city: 'Paradise',
            state: 'CA',
            postalCode: '12345',
            skills: ['Teaching'],
            availability: ['2024-10-17T05:00:00.000Z'],
        });
        expect(res.statusCode).toEqual(400);
        expect(res.body.errors).toEqual(expect.arrayContaining([
            expect.objectContaining({ msg: 'Street Address must be a string' }),
        ]));
    });

    it('should return 400 for city missing', async () => {
        const res = await request(app).post('/api/userProfile').send({
            fullName: 'Jane Doe',
            streetAddress: '123 Main St',
            state: 'CA',
            postalCode: '12345',
            skills: ['Teaching'],
            availability: ['2024-10-17T05:00:00.000Z'],
        });
        expect(res.statusCode).toEqual(400);
        expect(res.body.errors).toEqual(expect.arrayContaining([
            expect.objectContaining({ msg: 'City is required' }),
        ]));
    });

    it('should return 400 for city not being a string', async () => {
        const res = await request(app).post('/api/userProfile').send({
            fullName: 'Jane Doe',
            streetAddress: '123 Main St',
            city: 123,
            state: 'CA',
            postalCode: '12345',
            skills: ['Teaching'],
            availability: ['2024-10-17T05:00:00.000Z'],
        });
        expect(res.statusCode).toEqual(400);
        expect(res.body.errors).toEqual(expect.arrayContaining([
            expect.objectContaining({ msg: 'City must be a string' }),
        ]));
    });

    it('should return 400 for postal code missing', async () => {
        const res = await request(app).post('/api/userProfile').send({
            fullName: 'Jane Doe',
            streetAddress: '123 Main St',
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
        const res = await request(app).post('/api/userProfile').send({
            fullName: 'Jane Doe',
            streetAddress: '123 Main St',
            city: 'Paradise',
            state: 'CA',
            postalCode: '1234', // Invalid postal code
            skills: ['Teaching'],
            availability: ['2024-10-17T05:00:00.000Z'],
        });
        expect(res.statusCode).toEqual(400);
        expect(res.body.errors).toEqual(expect.arrayContaining([
            expect.objectContaining({ msg: 'Zip Code must be between 5 and 9 characters' }),
        ]));
    });

    it('should return 400 for state missing', async () => {
        const res = await request(app).post('/api/userProfile').send({
            fullName: 'Jane Doe',
            streetAddress: '123 Main St',
            city: 'Paradise',
            postalCode: '12345',
            skills: ['Teaching'],
            availability: ['2024-10-17T05:00:00.000Z'],
        });
        expect(res.statusCode).toEqual(400);
        expect(res.body.errors).toEqual(expect.arrayContaining([
            expect.objectContaining({ msg: 'State is required' }),
        ]));
    });

    it('should return 400 for state not being a 2-character string', async () => {
        const res = await request(app).post('/api/userProfile').send({
            fullName: 'Jane Doe',
            streetAddress: '123 Main St',
            city: 'Paradise',
            state: 'California',
            postalCode: '12345',
            skills: ['Teaching'],
            availability: ['2024-10-17T05:00:00.000Z'],
        });
        expect(res.statusCode).toEqual(400);
        expect(res.body.errors).toEqual(expect.arrayContaining([
            expect.objectContaining({ msg: 'State code must be exactly 2 characters' }),
        ]));
    });

    it('should return 400 for skills not having at least one skill', async () => {
        const res = await request(app).post('/api/userProfile').send({
            fullName: 'Jane Doe',
            streetAddress: '123 Main St',
            city: 'Paradise',
            state: 'CA',
            postalCode: '12345',
            skills: [], // No skills provided
            availability: ['2024-10-17T05:00:00.000Z'],
        });
        expect(res.statusCode).toEqual(400);
        expect(res.body.errors).toEqual(expect.arrayContaining([
            expect.objectContaining({ msg: 'Skills must be an array with at least one skill' }),
        ]));
    });

    it('should return 400 for availability not having at least one date', async () => {
        const res = await request(app).post('/api/userProfile').send({
            fullName: 'Jane Doe',
            streetAddress: '123 Main St',
            city: 'Paradise',
            state: 'CA',
            postalCode: '12345',
            skills: ['Teaching'],
            availability: [], // No availability dates provided
        });
        expect(res.statusCode).toEqual(400);
        expect(res.body.errors).toEqual(expect.arrayContaining([
            expect.objectContaining({ msg: 'Availability must be an array with at least one date' }),
        ]));
    });

    it('should return 400 for preferences not being a string', async () => {
        const res = await request(app).post('/api/userProfile').send({
            fullName: 'Jane Doe',
            streetAddress: '123 Main St',
            city: 'Paradise',
            state: 'CA',
            postalCode: '12345',
            skills: ['Teaching'],
            availability: ['2024-10-17T05:00:00.000Z'],
            preferences: 123,
        });
        expect(res.statusCode).toEqual(400);
        expect(res.body.errors).toEqual(expect.arrayContaining([
            expect.objectContaining({ msg: 'Preferences must be a string' }),
        ]));
    });

    it('should create a user profile successfully', async () => {
        const res = await request(app).post('/api/userProfile').send({
            fullName: 'Jane Doe',
            streetAddress: '123 Main St',
            city: 'Paradise',
            state: 'CA',
            postalCode: '12345',
            skills: ['Teaching'],
            availability: ['2024-10-17T05:00:00.000Z'],
        });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('fullName', 'Jane Doe');
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

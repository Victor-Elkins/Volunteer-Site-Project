const request = require('supertest');
const express = require('express');
const volunteerRoutes = require('../routes/volunteer'); 

const app = express();
app.use(express.json());
app.use('/api/volunteer', volunteerRoutes);

describe('Volunteer Matching API', () => {
    // Test for all volunteers (GET volunteer route)
    it('should return all volunteers', async () => {
        const res = await request(app).get('/api/volunteer');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(expect.arrayContaining([
            expect.objectContaining({ id: 1, name: 'John Doe' }),
            expect.objectContaining({ id: 2, name: 'Jane Smith' }),
            expect.objectContaining({ id: 3, name: 'Steven Lang' }),
            expect.objectContaining({ id: 4, name: 'Brandon James' }),
            expect.objectContaining({ id: 5, name: 'Emily Lee' }),
            expect.objectContaining({ id: 6, name: 'Derrick Kidd' }),
        ]));
    });

    // Test for volunteers with matching skills (GET volunteer route)
    it('should return volunteers with matching skills', async () => {
        const res = await request(app)
            .get('/api/volunteer/with-skills')
            .query({ skills: 'Physically Fit, Good with Childern' }); 

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(expect.arrayContaining([
            expect.objectContaining({ id: 1, name: 'John Doe' }), 
        ]));
        expect(res.body).not.toEqual(expect.arrayContaining([
            expect.objectContaining({ id: 2, name: 'Jane Smith' }),
            expect.objectContaining({ id: 3, name: 'Steven Lang' }),
        ]));
    });

    // Test for volunteers with matching skills. Should be empty (GET volunteer route)
    it('should return an empty array when no volunteers match the required skills', async () => {
        const res = await request(app)
            .get('/api/volunteer/with-skills')
            .query({ skills: 'Nonexistent Skill' }); 
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual([]);
    });

    // Test for updating volunteers' assigned events (PUT volunteer route)
    it('should update volunteers assigned to an event', async () => {
        const updateData = {
            peopleAssigned: ['John Doe', 'Jane Smith'],
            eventName: 'Event One',
            peopleToDelete: ['Derrick Kidd']
        };

        const res = await request(app)
            .put('/api/volunteer/update-people')
            .send(updateData);

        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toEqual('Event and volunteers updated successfully.');
        
        expect(res.body.volunteers).toEqual(expect.arrayContaining([
            expect.objectContaining({ name: 'John Doe', EventAssigned: expect.arrayContaining(['Event One']) }),
            expect.objectContaining({ name: 'Jane Smith', EventAssigned: expect.arrayContaining(['Event One']) }),
            expect.objectContaining({ name: 'Derrick Kidd', EventAssigned: expect.not.arrayContaining(['Event One']) }),
        ]));
    });

});
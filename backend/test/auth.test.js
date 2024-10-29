const request = require('supertest');
const express = require('express');
const session = require('express-session');
const authRoutes = require('../routes/auth');
const db = require('../db'); // Import the database connection

const app = express();
app.use(express.json());

app.use(session({
  secret: '00d4287e129abc006ad2be920d733c2e', // only hard-coded for development
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 1000 * 60 * 60 } // 1-hour session lifetime
}));

app.use('/api/auth', authRoutes);

// Clear the UserCredentials table before each test to ensure isolation
beforeEach((done) => {
  db.run('DELETE FROM UserCredentials', done);
});

describe('Auth Routes', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ username: 'testuser', password: 'Password123!' });
      
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('message', 'User registered successfully');
    });

    it('should return 400 when username is missing', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ password: 'Password123!' });
      
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message', 'Username is required');
    });

    it('should return 400 when password is missing', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ username: 'testuser' });
      
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message', 'Password is required');
    });

    it('should return 400 when the user already exists', async () => {
      // Register a user
      await request(app)
        .post('/api/auth/register')
        .send({ username: 'duplicateuser', password: 'Password123!' });

      // Try to register the same user again
      const res = await request(app)
        .post('/api/auth/register')
        .send({ username: 'duplicateuser', password: 'Password123!' });
      
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message', 'User already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login an existing user successfully', async () => {
      // Register a user first
      await request(app)
        .post('/api/auth/register')
        .send({ username: 'loginuser', password: 'Password123!' });

      // Try logging in with the same credentials
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: 'loginuser', password: 'Password123!' });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'Login successful');
    });

    it('should return 404 for a non-existent user', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: 'nonexistentuser', password: 'Password123!' });
      
      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('message', 'User not found');
    });

    it('should return 400 for incorrect password', async () => {
      // Register a user
      await request(app)
        .post('/api/auth/register')
        .send({ username: 'wrongpassuser', password: 'Password123!' });

      // Try logging in with the wrong password
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: 'wrongpassuser', password: 'WrongPassword!' });
      
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message', 'Invalid credentials');
    });

    it('should return 400 when username is missing', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ password: 'Password123!' });
      
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message', 'Username is required');
    });

    it('should return 400 when password is missing', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: 'missingpassuser' });
      
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message', 'Password is required');
    });
  });

  describe('GET /api/auth/check-auth', () => {
    it('should return isAuthenticated: true if user is logged in', async () => {
      // Register and login a user to set up a session
      await request(app)
        .post('/api/auth/register')
        .send({ username: 'authcheckuser', password: 'Password123!' });
      
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ username: 'authcheckuser', password: 'Password123!' });
  
      // Check authentication
      const res = await request(app).get('/api/auth/check-auth').set('Cookie', loginRes.headers['set-cookie']);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('isAuthenticated', true);
      expect(res.body).toHaveProperty('user.username', 'authcheckuser');
    });
  
    it('should return isAuthenticated: false if user is not logged in', async () => {
      const res = await request(app).get('/api/auth/check-auth');
  
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('isAuthenticated', false);
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should successfully logout the user', async () => {
      // Register a user first
      await request(app)
        .post('/api/auth/register')
        .send({ username: 'logoutuser', password: 'Password123!' });
  
      // Log in the user
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ username: 'logoutuser', password: 'Password123!' });
  
      // Perform logout
      const res = await request(app).post('/api/auth/logout').set('Cookie', loginRes.headers['set-cookie']);
      
      // Expect a successful logout response
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'Logout successful');
    });
  });
});

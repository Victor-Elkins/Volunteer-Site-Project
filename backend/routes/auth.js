const express = require('express');
const bcrypt = require('bcrypt'); // password hashing
const db = require('../db'); // Import the database connection

const router = express.Router();

// Registration route
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  console.log('Incoming registration request:', { username, password });

  if (!username) {
    console.log('Username missing in request.');
    return res.status(400).json({ message: 'Username is required' });
  }
  
  if (!password) {
    console.log('Password missing in request.');
    return res.status(400).json({ message: 'Password is required' });
  }

  // Check if the user already exists in the database
  const query = 'SELECT * FROM UserCredentials WHERE username = ?';
  db.get(query, [username], async (err, user) => {
    if (err) {
      console.error('Database error while checking user:', err.message);
      return res.status(500).json({ message: 'Database error' });
    }

    if (user) {
      console.log('User already exists:', user);
      return res.status(400).json({ message: 'User already exists' });
    }

    console.log('No existing user found, proceeding with registration.');
    
    // If no user exists, hash the password and insert into the database
    try {
      const passwordHash = await bcrypt.hash(password, 10);
      const insertQuery = 'INSERT INTO UserCredentials (username, password) VALUES (?, ?)';
      db.run(insertQuery, [username, passwordHash], (err) => {
        if (err) {
          console.error('Database error during user insertion:', err.message);
          return res.status(500).json({ message: 'Failed to register user' });
        }
        console.log('User registered successfully:', username);
        res.status(201).json({ message: 'User registered successfully' });
      });
    } catch (hashError) {
      console.error('Error hashing password:', hashError);
      return res.status(500).json({ message: 'Password hashing failed' });
    }
  });
});

// Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username) return res.status(400).json({ message: 'Username is required' });
  if (!password) return res.status(400).json({ message: 'Password is required' });

  try {
    // Find user in the database by username
    db.get('SELECT * FROM UserCredentials WHERE username = ?', [username], async (err, user) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Compare the password with the stored hash
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Store user info in session
      req.session.user = { username: user.username };
      req.session.user.id  = user.id;
      res.json({ message: 'Login successful' });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Check authentication route
router.get('/check-auth', (req, res) => {
  if (req.session && req.session.user) {
    return res.json({ isAuthenticated: true, user: req.session.user });
  }
  return res.json({ isAuthenticated: false });
});

// Logout route
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ message: 'Logout failed' });

    res.clearCookie('connect.sid'); // Clear the session cookie
    return res.status(200).json({ message: 'Logout successful' });
  });
});

module.exports = router;

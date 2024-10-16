const express = require('express');
const bcrypt = require('bcrypt'); // password hashing
const users = require('../users'); 

const router = express.Router();

// Registration route
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  if (!email) return res.status(400).json({ message: 'Email is required' });
  if (!password) return res.status(400).json({ message: 'Password is required' });

  const userExists = users.find(user => user.email === email);
  if (userExists) return res.status(400).json({ message: 'User already exists' });

  const passwordHash = await bcrypt.hash(password, 10);
  users.push({ email, passwordHash });
  res.status(201).json({ message: 'User registered successfully' });
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email) return res.status(400).json({ message: 'Email is required' });
  if (!password) return res.status(400).json({ message: 'Password is required' });

  const user = users.find(user => user.email === email);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) return res.status(400).json({ message: 'Invalid credentials' });

  req.session.user = { email: user.email }; // Store user in session
  res.json({ message: 'Login successful' });
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

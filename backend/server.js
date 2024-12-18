const express = require('express');
const session = require('express-session');
const cors = require('cors');
const db = require('./db');

const notificationsRoutes = require('./routes/notifications');
const historyRoutes = require('./routes/history');
const authRoutes = require('./routes/auth');
const userProfileRoute = require('./routes/userProfile');
const eventsRoutes = require('./routes/events');
const volunteerRoutes = require('./routes/volunteer');
const reportRoutes = require('./routes/reports');

// Enable CORS for all routes
const app = express();
app.use(cors({
  origin: 'http://localhost:5173', // Frontend url
  credentials: true, // Allow cookies to be sent with requests
}));
app.use(express.json()); // Enable JSON parsing for request bodies

// Express session middleware
app.use(session({
  secret: '00d4287e129abc006ad2be920d733c2e', // only hard-coded for development
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 1000 * 60 * 60 } // 1-hour session lifetime
}));

// Routes
app.use('/api/notifications', notificationsRoutes); // Notifications route
app.use('/api/history', historyRoutes); // History route
app.use('/api/auth', authRoutes); // Authorization route
app.use('/api/userProfile', userProfileRoute); // User profile route
app.use('/api/events', eventsRoutes); // Event route
app.use('/api/volunteer', volunteerRoutes(db)); // Volunteer route
app.use('/api/reports', reportRoutes); // Report route

const PORT = process.env.PORT || 5000; // Use PORT from environment or default to 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

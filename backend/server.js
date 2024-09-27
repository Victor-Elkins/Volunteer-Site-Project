const express = require('express');
const cors = require('cors');
const app = express();
const notificationsRoutes = require('./routes/notifications');
const historyRoutes = require('./routes/history');

// Enable CORS for all routes
app.use(cors());
app.use(express.json()); // Enable JSON parsing for request bodies

// Routes
app.use('/api/notifications', notificationsRoutes); // Notifications route
app.use('/api/history', historyRoutes); // History route

const PORT = process.env.PORT || 5000; // Use PORT from environment or default to 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

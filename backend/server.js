const express = require('express');
const cors = require('cors');
const app = express();
const notificationsRoutes = require('./routes/notifications');

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Enable JSON parsing for request bodies

// Routes
app.use('/api/notifications', notificationsRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = 3000;

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Middleware
app.use(express.json());
app.use(express.static('views'));

// Game routes
const gameRoutes = require('./routes/game');
app.use('/api/game', gameRoutes);

// Start server
app.listen(port, () => {
  console.log(`App running on http://localhost:${port}`);
});

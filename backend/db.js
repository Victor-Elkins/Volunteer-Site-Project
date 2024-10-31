const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Open a connection to the database file
const dbPath = path.resolve(__dirname, 'database/database.db');
const setupSqlPath = path.resolve(__dirname, 'setup.sql');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    return console.error('Error opening database:', err.message);
  }
  console.log('Connected to the SQLite database.');
});

// Enable foreign key constraints and execute setup.sql
db.serialize(() => {
  // Enable foreign key constraints
  db.run('PRAGMA foreign_keys = ON', (err) => {
    if (err) {
      console.error('Error enabling foreign keys:', err.message);
    } else {
      console.log('Foreign key constraints enabled.');
    }
  });

  // Read and execute the setup.sql file
  fs.readFile(setupSqlPath, 'utf8', (err, sql) => {
    if (err) {
      return console.error('Error reading setup.sql file:', err.message);
    }

    db.exec(sql, (err) => {
      if (err) {
        console.error('Error executing setup.sql:', err.message);
      } else {
        console.log('Database schema created/updated successfully.');
      }
    });
  });
});

module.exports = db;
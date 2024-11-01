const sqlite3 = require('sqlite3').verbose();
const db = require('./db'); 


db.serialize(() => {
  // Start a transaction to make the schema update safer
  db.run('BEGIN TRANSACTION');

  // Rename address column to address_1
  db.run(`ALTER TABLE UserProfile RENAME COLUMN address TO address_1`, (err) => {
    if (err) {
      console.error('Error renaming column:', err.message);
    } else {
      console.log('Renamed address to address_1');
    }
  });

  // Add a new column address_2
  db.run(`ALTER TABLE UserProfile ADD COLUMN address_2 TEXT`, (err) => {
    if (err) {
      console.error('Error adding address_2 column:', err.message);
    } else {
      console.log('Added address_2 column');
    }
  });

  // Commit the transaction
  db.run('COMMIT', (err) => {
    if (err) {
      console.error('Error committing transaction:', err.message);
    } else {
      console.log('Transaction committed successfully.');
    }
  });
});

// Close the database connection
db.close((err) => {
  if (err) {
    console.error('Error closing database:', err.message);
  } else {
    console.log('Database connection closed.');
  }
});



const sqlite3 = require('sqlite3').verbose();
const db = require('./db'); 

const dropAllData = () => {
    const tables = [
        'UserCredentials',
        'UserProfile',
        'EventDetails',
        'VolunteerHistory',
    ];

    db.serialize(() => {
        // Begin a transaction
        db.run("BEGIN TRANSACTION");

        tables.forEach((table) => {
            db.run(`DELETE FROM ${table}`, (err) => {
                if (err) {
                    console.error(`Error deleting data from ${table}:`, err.message);
                } else {
                    console.log(`All data deleted from ${table}`);
                }
            });
        });

        // Commit the transaction
        db.run("COMMIT", (err) => {
            if (err) {
                console.error("Error committing transaction:", err.message);
            } else {
                console.log("All data has been deleted from all tables.");
            }
        });
    });
};

// Execute the function
dropAllData();

// Close the database connection
db.close((err) => {
    if (err) {
        console.error("Error closing the database:", err.message);
    }
});
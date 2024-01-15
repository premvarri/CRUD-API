require("dotenv").config();
const sqlite3 = require('sqlite3').verbose();

const dbPath = 'C:/Users/nvarri/Downloads/test.db'; // Replace with the desired path

// Create a connection to an SQLite database file on disk
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) return console.error("Error opening database:", err.message);
  console.log('Connected to the SQLite database');

});

// Export the database instance for use in other modules
module.exports = {
   db
};

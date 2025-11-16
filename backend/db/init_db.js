import dotenv from 'dotenv';
import pool from './connection.js';

dotenv.config();

const createTableQuery = `
CREATE TABLE IF NOT EXISTS subscribers (
  id SERIAL PRIMARY KEY,
  fullname VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  email VARCHAR(255) UNIQUE NOT NULL,
  date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
`;

async function initializeDatabase() {
  const client = await pool.connect();
  try {
    await client.query(createTableQuery);
    console.log('Database initialized successfully. "subscribers" table is ready.');
  } catch (err) {
    console.error('Error initializing database:', err);
  } finally {
    client.release();
    pool.end(); // Close the pool after script execution
  }
}

initializeDatabase();

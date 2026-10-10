import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// PostgreSQL connection pool configuration
export const pool = new Pool({
  host: process.env.PG_HOST || 'localhost',
  port: parseInt(process.env.PG_PORT || '5432', 10),
  database: process.env.PG_DATABASE || 'portfolio_db',
  user: process.env.PG_USER || 'postgres',
  password: process.env.PG_PASSWORD || '',
  connectionTimeoutMillis: 3000,
});

let isDbConnected = false;

// Initialize and verify database connection
export const initDb = async () => {
  try {
    const client = await pool.connect();
    isDbConnected = true;
    console.log(' Successfully connected to PostgreSQL (pgAdmin 14)');

    // Automatically ensure contact_messages table exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id SERIAL PRIMARY KEY,
        name VARCHAR(120) NOT NULL,
        email VARCHAR(160) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log(' Table "contact_messages" verified/created.');
    client.release();
  } catch (err) {
    isDbConnected = false;
    console.warn('⚠️  PostgreSQL connection not active. Running with in-memory storage fallback.');
    console.warn(`   Detail: ${err.message}`);
  }
};

export const getDbStatus = () => isDbConnected;

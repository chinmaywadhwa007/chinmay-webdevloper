-- SQL Schema for PostgreSQL / pgAdmin 14
-- Database: portfolio_db

CREATE TABLE IF NOT EXISTS contact_messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index on created_at for fast chronological queries
CREATE INDEX IF NOT EXISTS idx_contact_created_at ON contact_messages (created_at DESC);

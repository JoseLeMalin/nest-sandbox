#!/bin/bash
set -e

# Create users table if it doesn't exist
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- Create users table
    CREATE TABLE IF NOT EXISTS users (
        user_id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE,
        full_name VARCHAR(255),
        first_name VARCHAR(255),
        last_name VARCHAR(255),
        gender VARCHAR(50) CHECK (gender IN ('man', 'woman', 'other', 'unknown')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Create an index on username for faster lookups
    CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

    -- Insert sample users
    INSERT INTO users (username, password, email, full_name) 
    VALUES 
        ('john', 'changeme', 'john@example.com', 'John Doe'),
        ('maria', 'guess', 'maria@example.com', 'Maria Garcia')
    ON CONFLICT (username) DO NOTHING;

    -- Create votes table (placeholder for future use)
    CREATE TABLE IF NOT EXISTS votes (
        vote_id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
        vote_value INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    COMMIT;
EOSQL

echo "Database initialization completed successfully!"

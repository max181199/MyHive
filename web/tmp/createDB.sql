CREATE TABLE IF NOT EXISTS hive_request (
    id SERIAL PRIMARY KEY,
    job_id TEXT,
    login TEXT,
    request TEXT,
    state TEXT,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
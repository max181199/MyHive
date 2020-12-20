CREATE TABLE IF NOT EXISTS hive_manager.hive_request (
    id SERIAL PRIMARY KEY,
    job_id TEXT,
    login TEXT,
    request TEXT,
    state TEXT,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS hive_manager.smsuploadfileinfo (
    id SERIAL PRIMARY KEY,
    login TEXT,
    name TEXT,
    state TEXT,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS hive_manager.altertableinfo (
    id SERIAL PRIMARY KEY,
    db TEXT,
    oldname TEXT,
    newname TEXT,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
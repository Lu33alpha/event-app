CREATE DATABASE eventapp;


-- =========================
-- TABLE USERS
-- =========================
CREATE TABLE users (
                       id SERIAL PRIMARY KEY,
                       username TEXT NOT NULL UNIQUE,
                       password_hash TEXT NOT NULL
);

-- =========================
-- TABLE EVENTS
-- =========================
CREATE TABLE events (
                        id SERIAL PRIMARY KEY,
                        name_event VARCHAR(255) NOT NULL,
                        nb_place INTEGER NOT NULL,
                        start_date DATE NOT NULL,
                        end_date DATE NOT NULL,
                        description TEXT,
                        owner INTEGER REFERENCES users(id) ON DELETE SET NULL,
                        place TEXT
);

-- =========================
-- TABLE EVENT_PARTICIPANTS
-- =========================
CREATE TABLE event_participants (
                                    id SERIAL PRIMARY KEY,
                                    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                                    event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
                                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                    UNIQUE(user_id, event_id)
);

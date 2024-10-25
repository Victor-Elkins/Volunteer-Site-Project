CREATE TABLE IF NOT EXISTS UserCredentials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS UserProfile (
    id INTEGER PRIMARY KEY,
    full_name TEXT NOT NULL,
    address TEXT,
    city TEXT,
    state TEXT,
    zipcode TEXT,
    skills TEXT,
    preferences TEXT,
    availability TEXT,
    FOREIGN KEY (id) REFERENCES UserCredentials(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS EventDetails (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_name TEXT NOT NULL,
    description TEXT,
    location TEXT,
    required_skills TEXT,
    urgency INTEGER CHECK(urgency BETWEEN 1 AND 5),
    event_date TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS VolunteerHistory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    event_id INTEGER NOT NULL,
    participation_date TEXT NOT NULL,
    session_active INTEGER DEFAULT 0, -- 0 means inactive, 1 means active
    FOREIGN KEY (user_id) REFERENCES UserCredentials(id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES EventDetails(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS VolunteerNotifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    event_id INTEGER NOT NULL,
    notification_date TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES UserCredentials(id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES EventDetails(id) ON DELETE CASCADE
);
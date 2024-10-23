const db = require('./db');
const { faker } = require('@faker-js/faker');

// Function to add random data to UserCredentials
const addUserCredentials = () => {
  const insertUserSql = `INSERT INTO UserCredentials (username, password) VALUES (?, ?);`;

  for (let i = 0; i < 10; i++) {
    const username = faker.internet.userName();
    const password = faker.internet.password();
    
    db.run(insertUserSql, [username, password], function(err) {
      if (err) {
        return console.error('Error inserting into UserCredentials:', err.message);
      }
      console.log(`Inserted into UserCredentials with ID: ${this.lastID}`);
    });
  }
};

// Function to add random data to UserProfile (linked to UserCredentials)
const addUserProfile = () => {
  const insertProfileSql = `
    INSERT INTO UserProfile (id, full_name, address, city, state, zipcode, skills, preferences, availability) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
  `;

  const states = ['CA', 'NY', 'TX', 'FL', 'GA'];
  const skillsList = ['Coding', 'Design', 'Marketing', 'Management'];
  const preferencesList = ['Remote', 'On-Site'];

  db.all('SELECT id FROM UserCredentials', [], (err, users) => {
    if (err) {
      return console.error('Error retrieving UserCredentials:', err.message);
    }
    
    users.forEach((user) => {
      const fullName = faker.person.fullName();
      const address = faker.location.streetAddress();
      const city = faker.location.city();
      const state = states[Math.floor(Math.random() * states.length)];
      const zipcode = faker.location.zipCode();
      const skills = skillsList.join(', ');
      const preferences = preferencesList[Math.floor(Math.random() * preferencesList.length)];
      const availability = 'Weekdays';

      db.run(insertProfileSql, [user.id, fullName, address, city, state, zipcode, skills, preferences, availability], function(err) {
        if (err) {
          return console.error('Error inserting into UserProfile:', err.message);
        }
        console.log(`Inserted into UserProfile for User ID: ${user.id}`);
      });
    });
  });
};

// Function to add random data to EventDetails
const addEventDetails = () => {
  const insertEventSql = `
    INSERT INTO EventDetails (event_name, description, location, required_skills, urgency, event_date)
    VALUES (?, ?, ?, ?, ?, ?);
  `;

  const eventNames = ['Charity Run', 'Food Drive', 'Tech Conference', 'Community Cleanup'];
  const eventLocations = ['New York', 'Los Angeles', 'Houston', 'Miami'];
  const skillsList = ['Coding', 'Design', 'Management'];

  for (let i = 0; i < 5; i++) {
    const eventName = eventNames[Math.floor(Math.random() * eventNames.length)];
    const description = faker.lorem.sentence();
    const location = eventLocations[Math.floor(Math.random() * eventLocations.length)];
    const requiredSkills = skillsList.join(', ');
    const urgency = Math.floor(Math.random() * 5) + 1;
    const eventDate = faker.date.future().toISOString();

    db.run(insertEventSql, [eventName, description, location, requiredSkills, urgency, eventDate], function(err) {
      if (err) {
        return console.error('Error inserting into EventDetails:', err.message);
      }
      console.log(`Inserted into EventDetails with ID: ${this.lastID}`);
    });
  }
};

// Function to add random data to VolunteerHistory (linking users to events)
const addVolunteerHistory = () => {
  const insertHistorySql = `
    INSERT INTO VolunteerHistory (user_id, event_id, participation_date) VALUES (?, ?, ?);
  `;

  db.all('SELECT id FROM UserCredentials', [], (err, users) => {
    if (err) {
      return console.error('Error retrieving UserCredentials:', err.message);
    }

    db.all('SELECT id FROM EventDetails', [], (err, events) => {
      if (err) {
        return console.error('Error retrieving EventDetails:', err.message);
      }

      users.forEach((user) => {
        events.forEach((event) => {
          const participationDate = faker.date.past().toISOString();

          db.run(insertHistorySql, [user.id, event.id, participationDate], function(err) {
            if (err) {
              return console.error('Error inserting into VolunteerHistory:', err.message);
            }
            console.log(`Inserted into VolunteerHistory: User ID ${user.id}, Event ID ${event.id}`);
          });
        });
      });
    });
  });
};

// Add data to all tables
addUserCredentials();
setTimeout(() => addUserProfile(), 2000); // Give a delay for user credentials to be inserted
setTimeout(() => addEventDetails(), 4000); 
setTimeout(() => addVolunteerHistory(), 6000); // Delay history to ensure users and events are inserted

const db = require("./db");

const migrate = async () => {

  await db.query(`

    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );


    CREATE TABLE IF NOT EXISTS notices (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      category VARCHAR(100) NOT NULL,
      community VARCHAR(100) NOT NULL,
      description TEXT,
      image_url TEXT,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      upvotes INTEGER DEFAULT 0,
      expires_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,


      is_team_finder BOOLEAN DEFAULT false,
      team_intent VARCHAR(20),
      event_name VARCHAR(255),
      event_type VARCHAR(50),
      roles_needed TEXT,
      team_size_needed INTEGER,
      contact_info VARCHAR(255),
      event_hub_url TEXT,
      team_status VARCHAR(20) DEFAULT 'open'
    );



    CREATE TABLE IF NOT EXISTS upvotes (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      notice_id INTEGER REFERENCES notices(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, notice_id)
    );



    CREATE TABLE IF NOT EXISTS team_interests (
      id SERIAL PRIMARY KEY,
      notice_id INTEGER REFERENCES notices(id) ON DELETE CASCADE,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      message TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(notice_id,user_id)
    );



    CREATE TABLE IF NOT EXISTS notice_replies (
      id SERIAL PRIMARY KEY,
      notice_id INTEGER REFERENCES notices(id) ON DELETE CASCADE,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      message TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );



    CREATE TABLE IF NOT EXISTS notifications (
      id SERIAL PRIMARY KEY,

      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,

      notice_id INTEGER REFERENCES notices(id) ON DELETE CASCADE,

      sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE,

      message TEXT NOT NULL,

      is_read BOOLEAN DEFAULT FALSE,

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

  `);


  console.log("Database migration complete ✅");

};


module.exports = migrate;
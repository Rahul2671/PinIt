const db = require("./db");

const migrate = async () => {
  await db.query(`
    ALTER TABLE notices ADD COLUMN IF NOT EXISTS is_team_finder BOOLEAN DEFAULT false;
    ALTER TABLE notices ADD COLUMN IF NOT EXISTS team_intent VARCHAR(20);
    ALTER TABLE notices ADD COLUMN IF NOT EXISTS event_name VARCHAR(255);
    ALTER TABLE notices ADD COLUMN IF NOT EXISTS event_type VARCHAR(50);
    ALTER TABLE notices ADD COLUMN IF NOT EXISTS roles_needed TEXT;
    ALTER TABLE notices ADD COLUMN IF NOT EXISTS team_size_needed INTEGER;
    ALTER TABLE notices ADD COLUMN IF NOT EXISTS contact_info VARCHAR(255);
    ALTER TABLE notices ADD COLUMN IF NOT EXISTS event_hub_url TEXT;
    ALTER TABLE notices ADD COLUMN IF NOT EXISTS team_status VARCHAR(20) DEFAULT 'open';

    CREATE TABLE IF NOT EXISTS team_interests (
      id SERIAL PRIMARY KEY,
      notice_id INTEGER NOT NULL REFERENCES notices(id) ON DELETE CASCADE,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      message TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(notice_id, user_id)
    );
  `);

  console.log("Database migration complete ✅");
};

module.exports = migrate;

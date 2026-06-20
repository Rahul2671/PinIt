const db = require("../config/db");

const noticeSelect = `
  SELECT
    notices.*,
    users.name AS poster_name,
    users.email AS poster_email,
    COUNT(DISTINCT upvotes.id) AS upvotes,
    COUNT(DISTINCT team_interests.id) AS interest_count
  FROM notices
  LEFT JOIN users ON notices.user_id = users.id
  LEFT JOIN upvotes ON notices.id = upvotes.notice_id
  LEFT JOIN team_interests ON notices.id = team_interests.notice_id
`;

const noticeGroupBy = `
  GROUP BY notices.id, users.name, users.email
  ORDER BY notices.created_at DESC
`;

const createNotice = async (req, res) => {
  try {
    const {
      title,
      category,
      community,
      description,
      is_team_finder,
      team_intent,
      event_name,
      event_type,
      roles_needed,
      team_size_needed,
      contact_info,
      event_hub_url,
    } = req.body;

    const user_id = req.user.id;
    const teamFinder = Boolean(is_team_finder);

    if (teamFinder) {
      if (!event_name?.trim()) {
        return res.status(400).json({ message: "Event name is required for team finder posts" });
      }
      if (!team_intent || !["recruiting", "looking_to_join"].includes(team_intent)) {
        return res.status(400).json({ message: "Valid team intent is required" });
      }
    }

    const result = await db.query(
      `
      INSERT INTO notices (
        title, category, community, description, user_id,
        is_team_finder, team_intent, event_name, event_type,
        roles_needed, team_size_needed, contact_info, event_hub_url
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
      RETURNING *
      `,
      [
        title,
        category,
        community,
        description,
        user_id,
        teamFinder,
        teamFinder ? team_intent : null,
        teamFinder ? event_name : null,
        teamFinder ? event_type || null : null,
        teamFinder ? roles_needed || null : null,
        teamFinder && team_size_needed ? Number(team_size_needed) : null,
        contact_info || null,
        event_hub_url || null,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const getNotices = async (req, res) => {
  try {
    const result = await db.query(`${noticeSelect} ${noticeGroupBy}`);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyNotices = async (req, res) => {
  try {
    const user_id = req.user.id;

    const result = await db.query(
      `
      ${noticeSelect}
      WHERE notices.user_id = $1
      ${noticeGroupBy}
      `,
      [user_id]
    );

    res.json(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const deleteNotice = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(`DELETE FROM notices WHERE id = $1`, [id]);

    res.json({ message: "Notice deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const upvoteNotice = async (req, res) => {
  try {
    const notice_id = req.params.id;
    const user_id = req.user.id;

    await db.query(
      `INSERT INTO upvotes (user_id, notice_id) VALUES ($1, $2)`,
      [user_id, notice_id]
    );

    res.json({ message: "Upvoted" });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(400).json({ message: "Already upvoted" });
    }

    res.status(500).json({ message: error.message });
  }
};

const expressInterest = async (req, res) => {
  try {
    const notice_id = req.params.id;
    const user_id = req.user.id;
    const { message } = req.body;

    const noticeResult = await db.query(
      `SELECT user_id, is_team_finder, team_status FROM notices WHERE id = $1`,
      [notice_id]
    );

    if (noticeResult.rows.length === 0) {
      return res.status(404).json({ message: "Notice not found" });
    }

    const notice = noticeResult.rows[0];

    if (!notice.is_team_finder) {
      return res.status(400).json({ message: "This notice is not a team finder post" });
    }

    if (notice.team_status === "full") {
      return res.status(400).json({ message: "This team is already full" });
    }

    if (notice.user_id === user_id) {
      return res.status(400).json({ message: "You cannot express interest on your own post" });
    }

    await db.query(
      `INSERT INTO team_interests (notice_id, user_id, message) VALUES ($1, $2, $3)`,
      [notice_id, user_id, message || null]
    );

    res.status(201).json({ message: "Interest expressed successfully" });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(400).json({ message: "You already expressed interest" });
    }

    res.status(500).json({ message: error.message });
  }
};

const getNoticeInterests = async (req, res) => {
  try {
    const notice_id = req.params.id;
    const user_id = req.user.id;

    const noticeResult = await db.query(
      `SELECT user_id FROM notices WHERE id = $1`,
      [notice_id]
    );

    if (noticeResult.rows.length === 0) {
      return res.status(404).json({ message: "Notice not found" });
    }

    if (noticeResult.rows[0].user_id !== user_id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const result = await db.query(
      `
      SELECT team_interests.id, team_interests.message, team_interests.created_at,
             users.name, users.email
      FROM team_interests
      JOIN users ON team_interests.user_id = users.id
      WHERE team_interests.notice_id = $1
      ORDER BY team_interests.created_at DESC
      `,
      [notice_id]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTeamStatus = async (req, res) => {
  try {
    const notice_id = req.params.id;
    const user_id = req.user.id;
    const { team_status } = req.body;

    if (!["open", "full"].includes(team_status)) {
      return res.status(400).json({ message: "Invalid team status" });
    }

    const result = await db.query(
      `
      UPDATE notices
      SET team_status = $1
      WHERE id = $2 AND user_id = $3 AND is_team_finder = true
      RETURNING *
      `,
      [team_status, notice_id, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Notice not found or not authorized" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createNotice,
  getNotices,
  getMyNotices,
  deleteNotice,
  upvoteNotice,
  expressInterest,
  getNoticeInterests,
  updateTeamStatus,
};

const express = require("express");

const {
  createNotice,
  getNotices,
  deleteNotice,
  upvoteNotice,
  getMyNotices,
  expressInterest,
  getNoticeInterests,
  updateTeamStatus,
} = require("../controllers/noticeController");

const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, createNotice);
router.get("/", getNotices);
router.get("/my-notices", authMiddleware, getMyNotices);
router.delete("/:id", authMiddleware, deleteNotice);
router.post("/:id/upvote", authMiddleware, upvoteNotice);
router.post("/:id/interest", authMiddleware, expressInterest);
router.get("/:id/interests", authMiddleware, getNoticeInterests);
router.patch("/:id/team-status", authMiddleware, updateTeamStatus);

module.exports = router;

const express = require("express");

const {
  createNotice,
  getNotices,
  getNoticeById,
  deleteNotice,
  upvoteNotice,
  getMyNotices,
  expressInterest,
  removeInterest,
  getNoticeInterests,
  updateTeamStatus,
  addReply,
  getReplies,
  getNotifications,
  markNotificationRead
} = require("../controllers/noticeController");


const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");



// CREATE NOTICE
router.post(
  "/",
  authMiddleware,
  createNotice
);



// GET ALL NOTICES
router.get(
  "/",
  authMiddleware,
  getNotices
);



// MY NOTICES
router.get(
  "/my-notices",
  authMiddleware,
  getMyNotices
);



// SINGLE NOTICE
router.get(
  "/:id",
  getNoticeById
);



// DELETE NOTICE
router.delete(
  "/:id",
  authMiddleware,
  deleteNotice
);



// UPVOTE
router.post(
  "/:id/upvote",
  authMiddleware,
  upvoteNotice
);



// TEAM FINDER INTEREST
router.post(
  "/:id/interest",
  authMiddleware,
  expressInterest
);

router.delete(
 "/:id/interest",
 authMiddleware,
 removeInterest
);


// OWNER VIEW INTERESTS
router.get(
  "/:id/interests",
  authMiddleware,
  getNoticeInterests
);



// UPDATE TEAM STATUS
router.patch(
  "/:id/team-status",
  authMiddleware,
  updateTeamStatus
);




// ======================
// REPLIES
// ======================


// Add reply
router.post(
  "/:id/reply",
  authMiddleware,
  addReply
);



// View replies
router.get(
  "/:id/replies",
  authMiddleware,
  getReplies
);




// ======================
// NOTIFICATIONS
// ======================


// get owner notifications
router.get(
  "/notifications/all",
  authMiddleware,
  getNotifications
);



// mark notification read
router.patch(
  "/notifications/:id/read",
  authMiddleware,
  markNotificationRead
);



module.exports = router;

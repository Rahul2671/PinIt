const express = require("express");

const router = express.Router();

const authMiddleware =
require("../middleware/authMiddleware");


const {
getProfile,
subscribe,
getSubscriptions,
removeSubscription
}
=
require("../controllers/userController");



// PROFILE
router.get(
"/profile",
authMiddleware,
getProfile
);



// SUBSCRIBE TO KEYWORD

router.post(
"/subscribe",
authMiddleware,
subscribe
);



// GET USER SUBSCRIPTIONS

router.get(
"/subscriptions",
authMiddleware,
getSubscriptions
);



// REMOVE SUBSCRIPTION

router.delete(
"/subscribe/:keyword",
authMiddleware,
removeSubscription
);



module.exports = router;

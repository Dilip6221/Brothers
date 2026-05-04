const express = require("express");
const router = express.Router();
const { saveSubscription,showSubscriptionData } = require("../controller/SubscriptionController.js");
const { authUser } = require('../middleware/auth');

router.post("/subscribe", saveSubscription );
router.post("/admin/subscribe",authUser, showSubscriptionData );

module.exports = router;

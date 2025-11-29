const express = require("express");
const router = express.Router();
const { saveSubscription,showSubscriptionData } = require("../controller/SubscriptionController.js");

router.post("/subscribe",saveSubscription );
router.post("/admin/subscribe",showSubscriptionData );

module.exports = router;

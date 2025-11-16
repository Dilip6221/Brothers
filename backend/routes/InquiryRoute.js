const express = require("express");
const router = express.Router();
const { createServiceInquiry } = require("../controller/InquieryController");
const { authOptional } = require("../middleware/auth.js");

router.post("/service-inquiry", authOptional, createServiceInquiry);

module.exports = router;

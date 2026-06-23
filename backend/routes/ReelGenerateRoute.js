const express = require("express");
const router = express.Router();
const { generateJobReel } = require("../controller/ReelGeneratorController.js");
const { authUser } = require('../middleware/auth');

// router.post("/admin/:jobId/generate-reel", authUser, generateJobReel);
router.post("/admin/:jobId/generate-reel",  generateJobReel);

module.exports = router;
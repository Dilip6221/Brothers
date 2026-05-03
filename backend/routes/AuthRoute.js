const express = require('express');
const router = express.Router();
const { sendOtp,verifyOtp,completeProfile,getUser } = require("../controller/AuthController");
const {authUser} = require('../middleware/auth');

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/complete-profile', completeProfile);
router.get('/user', authUser, getUser);


module.exports = router;
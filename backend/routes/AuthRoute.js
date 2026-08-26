const express = require('express');
const router = express.Router();
const { sendOtp,verifyOtp,completeProfile,getUser } = require("../controller/AuthController");
const {authUser, authAdminRole} = require('../middleware/auth');

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/complete-profile', (req, res, next) => {
	if (req.body.isAdminCreate === true) return authAdminRole(req, res, next);
	return next();
}, completeProfile);
router.get('/user', authUser, getUser);


module.exports = router;
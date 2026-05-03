// config/otpProvider.js

const FirebaseService = require('../services/FirebaseService');
const Msg91Service = require('../services/Msg91Service');
const provider = process.env.OTP_PROVIDER || 'firebase';

module.exports = provider === 'msg91'
    ? new Msg91Service()
    : new FirebaseService();
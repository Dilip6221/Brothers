const mongoose = require('mongoose');

const OtpSchema = new mongoose.Schema({
    phone: { type: String, required: true, index: true },
    otpHash: { type: String, required: true },
    expiresAt: { 
        type: Date, 
        required: true,
        index: { expires: 0 }
    },
    attempts: { type: Number, default: 0 },
    maxAttempts: { type: Number, default: 5 },
    isUsed: { type: Boolean, default: false },
    purpose: {
        type: String,
        enum: ['LOGIN','REGISTER'],
        default: 'LOGIN'
    },
    ip: String,
    resendCount: { type: Number, default: 0 },
    userAgent: String
}, { timestamps: true });


const Otp = mongoose.model('Otp',OtpSchema);
module.exports = { Otp };
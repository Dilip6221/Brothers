const OtpService = require('../services/OtpService');

class FirebaseService extends OtpService {
    async sendOtp(phone, otp) {
        console.log(`Firebase OTP: ${otp}`);
        return true;
    }

    async verifyOtp(phone, otp) {
        return true;
    }
}

module.exports = FirebaseService;
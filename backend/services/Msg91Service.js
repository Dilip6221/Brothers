const OtpService = require('./OtpService');
const axios = require('axios');

class Msg91Service extends OtpService {
    async sendOtp(phone, otp) {
        await axios.post('https://api.msg91.com/api/v5/otp', {
            mobile: phone,
            otp: otp
        }, {
            headers: {
                authkey: process.env.MSG91_AUTH_KEY
            }
        });

        return true;
    }

    async verifyOtp(phone, otp) {
        return true;
    }
}

module.exports = Msg91Service;
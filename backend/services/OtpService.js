class OtpService {
    async sendOtp(phone, otp) {
        throw new Error('sendOtp() must be implemented');
    }
    async verifyOtp(phone, otp) {
        throw new Error('verifyOtp() must be implemented');
    }
}
module.exports = OtpService;
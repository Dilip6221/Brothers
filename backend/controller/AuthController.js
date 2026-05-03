const { User } = require('../model/User');
const { Otp } = require('../model/Otp');
const bcrypt = require('bcryptjs');
const otpProvider = require('../config/otpProvider');
const jwt = require('jsonwebtoken');


const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1y' });
};

const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOtp = async (req, res) => {
    try {
        const { phone } = req.body;

        const lastOtp = await Otp.findOne({ phone }).sort({ createdAt: -1 });

        let resendCount = 0;
        const WINDOW = 2 * 60 * 1000;
        if (lastOtp) {
            const now = Date.now();
            const createdTime = new Date(lastOtp.createdAt).getTime();
            const diff = now - createdTime;
            if (diff < 60000) {
                const remaining = Math.ceil((60000 - diff) / 1000);
                return res.json({
                    success: false,
                    message: `Wait ${remaining}s to resend OTP`
                });
            }
            if (diff > WINDOW) {
                resendCount = 0;
            } else {
                if ((lastOtp.resendCount || 0) >= 3) {
                    return res.json({
                        success: false,
                        message: "Too many OTP requests. Try again after some time."
                    });
                }

                resendCount = (lastOtp.resendCount || 0) + 1;
            }
        }

        const otp = generateOtp();
        const otpHash = await bcrypt.hash(otp, 10);
        await Otp.updateMany({ phone, isUsed: false }, { isUsed: true });
        await Otp.create({
            phone,
            otpHash,
            resendCount,
            attempts: 0,
            maxAttempts: 5,
            isUsed: false,
            expiresAt: new Date(Date.now() + 60 * 1000),
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });

        await otpProvider.sendOtp(phone, otp);

        return res.json({
            success: true,
            message: "OTP Sent successfully"
        });

    } catch (err) {
        console.error("Send OTP Error:", err);
        return res.json({ success: false, error: err.message });
    }
};

const verifyOtp = async (req, res) => {
    try {
        const { phone, otp, name, email } = req.body;
        const otpDoc = await Otp.findOne({
            phone,
            isUsed: false
        }).sort({ createdAt: -1 });

        if (!phone || phone.length !== 10) {
            return res.json({ success: false, message: "Invalid phone" });
        }
        if (!otp) {
            return res.json({ success: false, message: "OTP required" });
        }
        if (!otpDoc) {
            return res.json({ success: false, message: 'OTP not found' });
        }
        if (otpDoc.attempts >= otpDoc.maxAttempts) {
            return res.json({ success: false, message: 'Too many attempts' });
        }
        if (otpDoc.expiresAt < new Date()) {
            otpDoc.isUsed = true;
            await otpDoc.save();
            return res.json({ success: false, message: 'OTP expired' });
        }
        const isMatch = await bcrypt.compare(otp, otpDoc.otpHash);
        if (!isMatch) {
            otpDoc.attempts += 1;
            await otpDoc.save();
            return res.json({ success: false, message: 'Invalid OTP' });
        }
        otpDoc.isUsed = true;
        await otpDoc.save();
        let user = await User.findOne({ phone });
        if (user && user.isProfileComplete) {
            const token = generateToken(user._id);
            res.cookie("token", token, {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
            });
            user.lastLoginAt = new Date();
            user.loginCount += 1;
            await user.save();
            return res.json({success: true,isNewUser: false});
        }
        return res.json({success: true,isNewUser: true});
    } catch (err) {
        console.error("OTP Verification Error:", err);
        res.json({ success: false, error: err.message });
    }
};
const completeProfile = async (req, res) => {
    try {
        const { phone, name, email } = req.body;
        let user = await User.findOne({ phone });
        if (!user) {
            user = await User.create({
                phone,
                name,
                email,
                isProfileComplete: true
            });
        } else {
            user.name = name;
            user.email = email;
            user.isProfileComplete = true;
            await user.save();
        }
        const token = generateToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
        });
        res.json({success: true,message: "Thank You for registering",user});
    } catch (err) {
        console.error("Complete Profile Error:", err);
        res.json({ success: false, error: err.message });
    }
};
const getUser = async (req, res) => {
  try {
    const user = req.user;
    return res.json({ success: true, user });
  } catch (err) {
    console.error("Get User Error:", err);
    res.json({ success: false ,message: "Failed to fetch user"});
  }
};

module.exports = { sendOtp, verifyOtp, completeProfile, getUser };
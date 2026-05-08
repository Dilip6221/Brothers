const { User } = require('../model/User');
const { Otp } = require('../model/Otp');
const bcrypt = require('bcryptjs');
const otpProvider = require('../config/otpProvider');
const jwt = require('jsonwebtoken');
const { sendWelcomeMail } = require('../mail/UserMail');


const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '30d' });
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
                sameSite: process.env.NODE_ENV === "PRODUCTION" ? "none" : "lax",
                maxAge: 30 * 24 * 60 * 60 * 1000,
            });
            user.lastLoginAt = new Date();
            user.loginCount += 1;
            user.status = "ACTIVE";
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
        const { phone, name, email,role,isAdminCreate } = req.body;
        if (!name || !email) {
            return res.json({success: false, message: "Name and email are required"});
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.json({success: false,message: "Invalid email format"});
        }
        const normalizedEmail = email.toLowerCase().trim();
        const existingUsers = await User.find({
            $or: [
                { phone },
                { email: normalizedEmail }
            ]
        });

        let user = null;
        for (const u of existingUsers) {
            if (u.phone === phone) {
                user = u;
            }
            if (u.email === normalizedEmail &&u.phone !== phone) {
                return res.json({success: false,message: "User with this email already exists"});
            }
        }

        if (!user) {
            user = await User.create({
                phone,
                name,
                role: role || "USER",
                email: normalizedEmail,
                isProfileComplete: true
            });
        } else {
            user.name = name;
            user.email = normalizedEmail;
            user.isProfileComplete = true;
            await user.save();
        }

        if (!isAdminCreate) {
            const token = generateToken(user._id);
            res.cookie("token", token, {
                httpOnly: true,
                secure: false,
                sameSite: process.env.NODE_ENV === "PRODUCTION" ? "none" : "lax",
                maxAge: 30 * 24 * 60 * 60 * 1000,
            });
        }
        sendWelcomeMail(user).catch(err =>
            console.error("Mail Error:", err)
        );
        return res.json({success: true,message: "Thank You for registering",user});
    } catch (err) {
        if (err.code === 11000) {
            return res.json({success: false,message: "Email already exists"});
        }
        return res.json({success: false,error: err.message});
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
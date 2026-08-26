const { User } = require('../model/User');
const { Otp } = require('../model/Otp');
const bcrypt = require('bcryptjs');
const otpProvider = require('../config/otpProvider');
const jwt = require('jsonwebtoken');
// const { sendWelcomeMail } = require('../mail/UserMail');


const generateToken = (user) => {
    const expiresIn = user.role === "ADMIN" ? "1h" : "30d";
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn });
};

const generateProfileToken = (phone) => jwt.sign(
    { phone, purpose: 'PROFILE_COMPLETION' },
    process.env.JWT_SECRET,
    { expiresIn: '10m' }
);

const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOtp = async (req, res) => {
    try {
        const { phone } = req.body;
        if (!/^[6-9]\d{9}$/.test(phone || '')) {
            return res.status(400).json({ success: false, message: 'Invalid phone number' });
        }

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
        const { phone, otp } = req.body;
        if (!/^[6-9]\d{9}$/.test(phone || '') || !/^\d{6}$/.test(otp || '')) {
            return res.status(400).json({ success: false, message: 'Invalid phone or OTP' });
        }
        const otpDoc = await Otp.findOne({
            phone,
            isUsed: false
        }).sort({ createdAt: -1 });

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
            const token = generateToken(user);
            const isAdmin = user.role === "ADMIN";
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: isAdmin ? 1 * 60 * 60 * 1000 : 30 * 24 * 60 * 60 * 1000,
            });
            user.lastLoginAt = new Date();
            user.loginCount += 1;
            user.status = "ACTIVE";
            await user.save();
            return res.json({success: true,isNewUser: false});
        }
        return res.json({ success: true, isNewUser: true, profileToken: generateProfileToken(phone) });
    } catch (err) {
        console.error("OTP Verification Error:", err);
        res.json({ success: false, error: err.message });
    }
};
const completeProfile = async (req, res) => {
    try {
        const { phone, name, profileToken, role, isAdminCreate } = req.body;
        if (!/^[6-9]\d{9}$/.test(phone || '') || !name?.trim()) {
            return res.status(400).json({ success: false, message: 'Valid phone and name are required' });
        }
        const adminRole = ['USER', 'STAFF', 'ADMIN'].includes(role) ? role : 'USER';
        if (!isAdminCreate) {
            const decoded = jwt.verify(profileToken || '', process.env.JWT_SECRET);
            if (decoded.purpose !== 'PROFILE_COMPLETION' || decoded.phone !== phone) {
                return res.status(401).json({ success: false, message: 'OTP verification required' });
            }
        }
        const existingUsers = await User.find({ phone });

        let user = null;
        for (const u of existingUsers) {
            if (u.phone === phone) {
                user = u;
            }
        }

        if (!user) {
            user = await User.create({
                phone,
                name,
                role: isAdminCreate && req.user?.role === 'ADMIN' ? adminRole : 'USER',
                isProfileComplete: true
            });
        } else {
            user.name = name;
            if (isAdminCreate && req.user?.role === 'ADMIN') user.role = adminRole;
            user.isProfileComplete = true;
            await user.save();
        }

        if (!isAdminCreate) {
            const token = generateToken(user);
            const isAdmin = user.role === "ADMIN";
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: isAdmin ? 1 * 60 * 60 * 1000 : 30 * 24 * 60 * 60 * 1000,
            });
        }
        // sendWelcomeMail(user).catch(err => console.error("Mail Error:", err));
        return res.json({success: true,message: "Thank You for registering",user});
    } catch (err) {
        if (err.code === 11000) {
            return res.json({success: false,message: "Phone number already exists"});
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
const { User, transporter } = require('../model/User.js');
const jwt = require('jsonwebtoken');
const crypto = require("crypto");
const bcrypt = require('bcryptjs')
const { sendWelcomeMail } = require('../mail/UserMail.js');

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '15d' });
};

const registerUser = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;
        if (!name || !email || !password || !phone) {
            return res.json({ success: false, message: 'All fields are required' });
        }
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(phone)) {
            return res.json({ success: false, message: 'Please enter a valid phone number' });
        }
        const exitUser = await User.findOne({ email });
        if (exitUser) {
            return res.json({ success: false, message: 'User already exists' });
        }
        const newUser = await User.create({ name, email, password, phone });
        await sendWelcomeMail(newUser);
        res.json({ success: true, message: 'User Created Succesfully' });
    } catch (error) {
        console.error('Error in registerUser:', error);
        res.json({ success: false, message: error.message });
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.json({ success: false, message: 'All fields are required' });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: 'Register user could not be found'});
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.json({ success: false, message: 'Please enter correct password' });
        }
        const token = generateToken(user._id);
            res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 24 * 60 * 60 * 1000,
        });
                await sendWelcomeMail(email);

        res.json({ success: true, message: 'Login Successful', token });
    } catch (error) {
        console.error('Error in loginUser:', error);
        res.json({ success: false, message: error.message });
    }
}
const getUserData = async (req, res) => {
    try {
        const user = req.user;
        return res.json({ success: true, user });
    } catch(error) {
        console.error('Error in getting User Data:', error);
        res.json({ success: false, message: error.message });
    }
}
const logoutUser = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", 
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    return res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout Error:", error);
    return res.status(500).json({ success: false, message: "Logout failed" });
  }
};


const sendForgotPasswordEmail = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.json({ success: false, message: 'Email is required' });
        }
        const exitUser = await User.findOne({ email: email });

        if (!exitUser) {
            return res.json({ success: false, message: 'User does not exist' });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");
        // Save hash & expiry in DB
        exitUser.resetPasswordTokenHash = resetTokenHash;
        exitUser.resetPasswordTokenExpire = Date.now() + 15 * 60 * 1000;
        await exitUser.save();
        const resetLink = `${process.env.FRONTEND_URL}/forget-password/${resetToken}`;
        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: exitUser.email,
            subject: "Password Reset Request - Brother's Garage 🚗",
            html: `
                <html>
                    <body style="font-family: 'Arial', sans-serif; background-color: #f4f4f7; margin: 0; padding: 0;">
                        <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                            <td align="center">
                            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; margin: 20px; padding: 40px; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                                <tr>
                                <td align="center" style="padding-bottom: 20px;">
                                    <h1 style="color: #333333; font-size: 24px; margin: 0;">Brother's Garage</h1>
                                </td>
                                </tr>
                                <tr>
                                <td style="color: #555555; font-size: 16px; line-height: 1.5;">
                                    <h2 style="color: #333333;">Hello ${exitUser.name},</h2>
                                    <p>You requested a password reset for your Brother's Garage account.</p>
                                    <p>Click the button below to reset your password:</p>
                                    <p style="text-align: center; margin: 30px 0;">
                                    <a href="${resetLink}" target="_blank" style="
                                        background-color: #4CAF50;
                                        color: white;
                                        padding: 15px 25px;
                                        text-decoration: none;
                                        border-radius: 6px;
                                        font-weight: bold;
                                        font-size: 16px;
                                        display: inline-block;
                                        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                                        transition: all 0.3s ease;
                                    "
                                    onmouseover="this.style.backgroundColor='#45a049'"
                                    onmouseout="this.style.backgroundColor='#4CAF50'"
                                    >Reset Password</a>
                                    </p>
                                    <p><b>Note:</b> This link is valid only for 15 minutes.</p>
                                    <p>If you did not request this, please ignore this email.</p>
                                </td>
                                </tr>
                                <tr>
                                <td align="center" style="padding-top: 30px; font-size: 12px; color: #999999;">
                                    © 2025 Brother's Garage. All rights reserved.
                                </td>
                                </tr>
                            </table>
                            </td>
                        </tr>
                        </table>
                    </body>
                </html>
            `,
        });
        res.json({ success: true, message: "Password reset link sent to email!" });
    } catch (error) {
        console.error('Error in sendForgotPasswordEmail:', error);
        res.json({ success: false, message: error.message });
    }
}
const resetPassword = async (req, res) => {
    try {
        const token = req.params.token;
        const { newPassword } = req.body;

        if (!token || !newPassword) {
            return res.json({ success: false, message: "Token and new password required" });
        }

        const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
        const user = await User.findOne({
            resetPasswordTokenHash: tokenHash,
            resetPasswordTokenExpire: { $gt: Date.now() },
        });
        if (!user) {
            return res.json({ success: false, message: "Invalid or expired token" });
        }

        user.password = newPassword;
        user.resetPasswordTokenHash = undefined;
        user.resetPasswordTokenExpire = undefined;
        await user.save();

        res.json({ success: true, message: "Password reset successful! 🚀" });
    } catch (error) {
        console.error("Reset password error:", error);
        res.json({ success: false, message: error.message });
    }
};
const changePassword = async (req,res) =>{
    try{
        const { currentPassword,newPassword,confirmPassword } = req.body;
        if(!currentPassword || !newPassword || !confirmPassword){
            return res.json({success:false,message:'All field are required'});
        }
        const user =await User.findById(req.user._id);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Current password is incorrect" });
        }
        if (newPassword !== confirmPassword) {
            return res.json({ success: false, message: "Passwords do not match" });
        }
        user.password = newPassword;
        await user.save();
        res.json({ success: true, message: "Password reset successfully" });
    } catch(error) {
        console.error('Error in Reset password:', error);
        res.json({ success: false, message: error.message });
    }
}

module.exports = { registerUser, loginUser, sendForgotPasswordEmail, resetPassword, getUserData,changePassword,logoutUser};
const { User, transporter } = require('../model/User.js');
const { Inquiry } = require('../model/Inquiery.js');
const jwt = require('jsonwebtoken');
const crypto = require("crypto");
const bcrypt = require('bcryptjs')
const { sendWelcomeMail } = require('../mail/UserMail.js');
const exportToCSV = require("../config/csv.js");

/* For Generate token */
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '15d' });
};
/* Register user use */
const registerUser = async (req, res) => {
    try {
        const { name, email, password, phone, role } = req.body;
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
        const newUserData = { name, email, password, phone };
        if (role) {
            newUserData.role = role;
        }
        const newUser = await User.create(newUserData);
        await sendWelcomeMail(newUser);  // For New User send welcome mail
        res.json({ success: true, message: 'User Created Succesfully' });
    } catch (error) {
        console.error('Error in registerUser:', error);
        res.json({ success: false, message: error.message });
    }
}
/* Update User Data in admin panel */
const updateUserData = async(req,res) => {
    try{
       const {_id,name, email, phone, role } =  req.body;
        if (!_id,!name || !email || !phone || !role) {
            return res.json({ success: false, message: 'All fields are required' });
        }
        const user = await User.findById(_id);
        if(!user){
            return res.json({success: false,message:'User Not Found'});
        }
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(phone)) {
            return res.json({ success: false, message: 'Please enter a valid phone number' });
        }
        if (email !== user.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                return res.json({success: false,message: "Email already in use by another user"});
            }
        }
        user.name = name;
        user.email = email;
        user.phone = phone;
        user.role = role;
        await user.save();
        return res.json({ success: true, message: 'User updated successfully'});
    }catch(error){
        console.error('Error in Update User Data:', error);
        res.json({ success: false, message: error.message });

    }
}
/* For Login a user using email and password */
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.json({ success: false, message: 'All fields are required' });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: 'Register user could not be found' });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.json({ success: false, message: 'Please enter correct password' });
        }
        const token = generateToken(user._id);
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 15 * 24 * 60 * 60 * 1000,
        });
        // await sendWelcomeMail(email);

        res.json({ success: true, message: 'Login Successful', token });
    } catch (error) {
        console.error('Error in loginUser:', error);
        res.json({ success: false, message: error.message });
    }
}
/* Get a token wise single user */
const getUserData = async (req, res) => {
    try {
        const user = req.user;
        return res.json({ success: true, user });
    } catch (error) {
        console.error('Error in getting User Data:', error);
        res.json({ success: false, message: error.message });
    }
}
/* Logout user */
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
/* Send Forget password mail using email */
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
/* Save a reset forget password in db using token */
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
/* When user is login that time change the password using their old password */
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;
        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.json({ success: false, message: 'All field are required' });
        }
        const user = await User.findById(req.user._id);
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
    } catch (error) {
        console.error('Error in Reset password:', error);
        res.json({ success: false, message: error.message });
    }
}
/* All useer data */
const allUsers = async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.json({ success: true, data: users });
    } catch (error) {
        console.error('Error in fetching all users:', error);
        res.json({ success: false, message: error.message });
    }
}

// For admin side Dashboard Data count
const getDashboardDataCount = async (req, res) => {
    try {
        const totalEmployees = await User.countDocuments();
        const totalStaff = await User.countDocuments({ role: { $in: ["STAFF", "ADMIN"] } });
        const totalCustomers = await User.countDocuments({ role: "USER" });
        const totalInquiries = await Inquiry.countDocuments();
        const pendingInquiries = await Inquiry.countDocuments({ status: "PENDING" });
        const completedInquiries = await Inquiry.countDocuments({ status: "COMPLETED" });
        const cancelledInquiries = await Inquiry.countDocuments({ status: "COMPLETED" });

        res.json({
            success: true,
            data: {
                totalEmployees,
                totalCustomers,
                totalStaff,
                totalInquiries,
                pendingInquiries,
                completedInquiries,
                cancelledInquiries,
            }
        });
    } catch (error) {
        res.json({ success: false, message: "Error For Counting dashboard", error: error.message });
    }
};

/* For Admin side export user information */
const exportUsersData = async (req, res) => {
    try {
        const { filter } = req.body;

        let query = {};

        if (filter === "USER") query.role = "USER";
        if (filter === "STAFF") query.role = { $in: ["STAFF", "ADMIN"] };
        if (filter === "ALL") query = {};
        const users = await User.find(query);
        let csv = "Name,Email,Phone,Role\n";
        users.forEach(u => {
            csv += `${u.name},${u.email},${u.phone},${u.role}\n`;
        });
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", "attachment; filename=users.csv");
        res.send(csv);
    } catch (error) {
        res.status(500).json({ success: false, message: "CSV export failed" });
    }
};
/* Admin side user list change status active or not */
const changeUserStatus = async (req,res) =>  {
    try {
        const { userId, status } = req.body;
        if (!userId || !status) {          
            return res.json({success: false,message: "All fields are required",});
        }
        const updatedUser = await User.findByIdAndUpdate(userId,{ status },{ new: true });
        if (!updatedUser) {
            return res.json({success: false,message: "User not found"});
        }
        return res.json({success: true,message: `User status changed to ${status}`,});
    } catch (error) {
        console.log(error);
        return res.json({success: false,message: "Something went wrong"});
    }
}
module.exports = { registerUser, loginUser, sendForgotPasswordEmail, resetPassword, getUserData, changePassword, logoutUser, allUsers, getDashboardDataCount, exportUsersData,changeUserStatus,updateUserData };
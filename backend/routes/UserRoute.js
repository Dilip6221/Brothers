const express = require('express');
const userRoute = express.Router();
const { registerUser,loginUser,sendForgotPasswordEmail,resetPassword ,getUserData,changePassword,logoutUser, allUsers,getDashboardDataCount,exportUsersData,changeUserStatus,updateUserData,getUsersForJob,/* previewWelcomeMail */ } = require('../controller/UserController');
const {authUser,authAdminRole,authForAndroid} = require('../middleware/auth');

// Legacy email/password authentication is intentionally disabled.
// userRoute.post('/register', registerUser);
// userRoute.post('/preview-welcome-mail', previewWelcomeMail);
// userRoute.post('/login', loginUser);
// userRoute.post('/forget-pass', sendForgotPasswordEmail);
// userRoute.post("/forget-password/:token", resetPassword);
userRoute.get("/get-user-data/",authUser, getUserData);
userRoute.get("/get-android-user-data/",authForAndroid, getUserData);
userRoute.post("/reset-password/",authUser, changePassword);
userRoute.post("/logout/",authUser, logoutUser);
userRoute.post("/admin/user-data",authAdminRole, allUsers);
userRoute.post("/admin/dashboard-stats",authAdminRole, getDashboardDataCount);
userRoute.post("/admin/user-export", authAdminRole, exportUsersData);
userRoute.post("/admin/update-status", authAdminRole, changeUserStatus);
userRoute.post("/admin/update-user-data", authAdminRole, updateUserData);
userRoute.get("/admin/get-user-job", authAdminRole, getUsersForJob);  // This route userfull for crateing Car users that time

module.exports = userRoute;
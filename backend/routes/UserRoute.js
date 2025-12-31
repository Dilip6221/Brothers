const express = require('express');
const userRoute = express.Router();
const { registerUser,loginUser,sendForgotPasswordEmail,resetPassword ,getUserData,changePassword,logoutUser, allUsers,getDashboardDataCount,exportUsersData,changeUserStatus,updateUserData } = require('../controller/UserController');
const {authUser,authForAndroid} = require('../middleware/auth');

userRoute.post('/register', registerUser);
userRoute.post('/login', loginUser);
userRoute.post('/forget-pass', sendForgotPasswordEmail);
userRoute.post("/forget-password/:token", resetPassword);  
userRoute.get("/get-user-data/",authUser, getUserData);
userRoute.get("/get-android-user-data/",authForAndroid, getUserData);
userRoute.post("/reset-password/",authUser, changePassword);
userRoute.post("/logout/",authUser, logoutUser);
userRoute.post("/admin/user-data", allUsers);
userRoute.post("/admin/dashboard-stats", getDashboardDataCount);
userRoute.post("/admin/user-export", exportUsersData);
userRoute.post("/admin/update-status", changeUserStatus);
userRoute.post("/admin/update-user-data", updateUserData);

module.exports = userRoute;
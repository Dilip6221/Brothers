const express = require('express');
const userRoute = express.Router();
const { registerUser,loginUser,sendForgotPasswordEmail,resetPassword ,getUserData,changePassword} = require('../controller/UserController');
const authUser =require('../middleware/auth')


userRoute.post('/register', registerUser);
userRoute.post('/login', loginUser);
userRoute.post('/forget-pass', sendForgotPasswordEmail);
userRoute.post("/forget-password/:token", resetPassword);  
userRoute.get("/get-user-data/",authUser, getUserData);
userRoute.post("/reset-password/",authUser, changePassword);

module.exports = userRoute;
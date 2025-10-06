const express = require('express');
const userRoute = express.Router();
const { registerUser,loginUser,sendForgotPasswordEmail,resetPassword} = require('../controller/UserController');


userRoute.post('/register', registerUser);
userRoute.post('/login', loginUser);
userRoute.post('/forget-pass', sendForgotPasswordEmail);
userRoute.post("/forget-password/:token", resetPassword);  
module.exports = userRoute;
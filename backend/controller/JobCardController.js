const { UserCars } = require('../model/UserCars.js');
const mongoose = require("mongoose");


const getUserCars = async (req, res) => {
  try {
    const cars = await UserCars.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });
    res.json({ success: true, data: cars });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};
const createUserCar = async (req, res) => {
  try {
    const {userId,brand,model,year,color,registrationNumber,vinNumber} = req.body;
    if (!userId || !brand || !model || !year || !registrationNumber) {
      return res.json({success: false,message: "Required fields missing"});
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.json({success: false,message: "Invalid User ID"});
    }
    const car = await UserCars.create({userId,brand,model,year,color,registrationNumber,vinNumber});
    res.json({success: true,message: "Car added successfully",data: car});
  } catch (err) {
    console.error(err);
    res.json({success: false,message: err.message});
  }
};
module.exports = { getUserCars, createUserCar };

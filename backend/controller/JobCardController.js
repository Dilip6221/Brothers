const { UserCars } = require('../model/UserCars.js');
const mongoose = require("mongoose");
const { ServiceJobs } = require("../model/ServiceJobs.js");
const { User } = require('../model/User.js');


// Admin Side listing for user cars
// router.post("/admin/user-cars",getUserCars );
const getUserCars = async (req, res) => {
  try {
    const cars = await UserCars.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });
    res.json({ success: true, data: cars });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: err.message });
  }
};

/* Admin Side creating user cars 
router.post("/admin/user-cars/create",createUserCar ); */
const createUserCar = async (req, res) => {
  try {
    const { userId, brand, model, year, color, registrationNumber, vinNumber } = req.body;
    if (!userId || !brand || !model || !year || !registrationNumber) {
      return res.json({ success: false, message: "Required fields missing" });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.json({ success: false, message: "Invalid User ID" });
    }
    const car = await UserCars.create({ userId, brand, model, year, color, registrationNumber, vinNumber });
    res.json({ success: true, message: "Car added successfully", data: car });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: err.message });
  }
};

const adminJobCardList = async (req, res) => {
  try {
    const jobs = await ServiceJobs.find()
      .populate({
        path: "userId",
        select: "name email"
      })
      .populate({
        path: "carId",
        select: "brand model year registrationNumber vinNumber"
      })
      .sort({ createdAt: -1 });
    return res.json({ success: true, data: jobs });
  } catch (error) {
    console.error("JobCard List Error:", error);
    return res.json({ success: false, message: "Failed to fetch Job Cards" });
  }
};

const getJobCardById = async (req, res) => {
  try {
    const job = await ServiceJobs.findById(req.params.id)
      .populate("userId", "name email")
      .populate("carId", "brand model registrationNumber year vinNumber");

    if (!job) {
      return res.json({ success: false, message: "Job not found" });
    }
    res.json({ success: true, data: job });
  } catch (error) {
    console.error("Single Job Card Erroe:", error);
    res.json({ success: false, message: "Job Card Not Found" });
  }
};

const getCarsByUser = async (req, res) => {
  const { userId } = req.params;
  const cars = await UserCars.find({ userId, isActive: true }).select("brand model year registrationNumber");
  res.json({ success: true, data: cars });
};

const generateJobCode = async () => {
  const count = await ServiceJobs.countDocuments();
  return `JOB-${String(count + 1).padStart(5, "0")}`;
};

const createJobCard = async (req, res) => {
  try {
    const { userId, carId, expectedDelivery, customerNotes } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "Invalid user" });
    }
    const car = await UserCars.findOne({ _id: carId, userId });
    if (!car) {
      return res.json({ success: false, message: "Car does not belong to selected user" });
    }
    const jobCode = await generateJobCode();
    const job = await ServiceJobs.create({
      jobCode,
      userId,
      carId,
      expectedDelivery,
      customerNotes,
      timeline: [
        {
          stage: "Job Created",
          status: "PENDING",
          note: "Job Card created by admin"
        }
      ]
    });
    res.json({ success: true, message: "Service job created successfully" });
  } catch (err) {
    console.log(err.message)
    res.json({ success: false, message: "Something went wrong when creating job card" });
  }
};

const updateJobProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, progressPercent, note, expectedDelivery } = req.body;

    const job = await ServiceJobs.findById(id);
    if (!job) {
      return res.json({ success: false, message: "Job not found" });
    }

    if (status) job.status = status;
    if (progressPercent !== undefined)
      job.progressPercent = progressPercent;
    if (expectedDelivery)
      job.expectedDelivery = expectedDelivery;

    job.timeline.push({
      stage: "JOB UPDATE",
      status: job.status,
      note,
      updatedAt: new Date()
    });

    await job.save();

    res.json({
      success: true,
      message: "Job progress updated successfully"
    });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Failed to update job progress" });
  }
};

module.exports = { getUserCars, createUserCar, adminJobCardList, getJobCardById, getCarsByUser, createJobCard, updateJobProgress };
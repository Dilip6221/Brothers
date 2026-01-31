const { UserCars } = require('../model/UserCars.js');
const mongoose = require("mongoose");
const { ServiceJobs } = require("../model/ServiceJobs.js");
const { User } = require('../model/User.js');
const { JobServices } = require('../model/JobServices.js');
const { JobMedia } = require('../model/JobMedia.js');
const cloudinary = require("../config/cloudinary");

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
    const { stage, note, progressPercent, expectedDelivery } = req.body;

    const STATUS_MAP = {
      CHECK_IN: "PENDING",
      INSPECTION: "PROGRESS",
      WORK_STARTED: "PROGRESS",
      PART_REPLACED: "PROGRESS",
      QUALITY_CHECK: "PROGRESS",
      READY: "COMPLETED",
      DELIVERED: "DELIVERED"
    };

    const job = await ServiceJobs.findById(req.params.id);
    if (!job) return res.json({ success: false, message: "Job not found" });

    job.currentStage = stage;
    job.progressPercent = progressPercent;
    job.status = STATUS_MAP[stage];
    job.expectedDelivery = expectedDelivery;
    job.timeline.push({ stage, note });
    await job.save();
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Failed to update job progress" });
  }
};


const createJobService = async (req, res) => {
  try {
    const { jobId, serviceName, price } = req.body;
    const service = await JobServices.create({
      jobId,
      serviceName,
      price: Number(price),
    });

    res.json({ success: true, data: service });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: err.message });
  }
};

const getJobServicesByJob = async (req, res) => {
  try {
    const services = await JobServices.find({ jobId: req.params.jobId });
    res.json({ success: true, data: services });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteJobService = async (req, res) => {
  try {
    await JobServices.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


const getJobMedia = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { stage } = req.query;
    const filter = { jobId, isActive: true };
    if (stage) filter.stage = stage;
    const media = await JobMedia.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: media });
  } catch (err) {
    res.json({ success: false, message: "Failed to fetch media" });
  }
};

const uploadJobMedia = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { stage } = req.body;
    if (!stage) {
      return res.json({ success: false, message: "Stage is required" });
    }
    if (!req.file) {
      return res.json({ success: false, message: "No file uploaded" });
    }
    const job = await ServiceJobs.findById(jobId);
    if (!job) {
      return res.json({ success: false, message: "Job not found" });
    }
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: `job-media/${jobId}/${stage}`,
          resource_type: "auto"
        },
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      ).end(req.file.buffer);
    });
    const media = await JobMedia.create({
      jobId,
      stage,
      mediaType: uploadResult.resource_type === "video" ? "video" : "photo",
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      uploadedBy: req.user?._id || null
    });
    res.json({ success: true, message: "Media uploaded", data: media });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Upload failed" });
  }
};
/* ===================== DELETE MEDIA ===================== */
const deleteJobMedia = async (req, res) => {
  try {
    const { mediaId } = req.params;
    const media = await JobMedia.findById(mediaId);
    if (!media) {
      return res.json({ success: false, message: "Media not found" });
    }
    media.isActive = false;
    await media.save();
    return res.json({ success: true, message: "Media deleted" });
  } catch (err) {
    console.log(err.message);
    return res.json({ success: false, message: "Delete failed" });
  }
};

module.exports = { getUserCars, createUserCar, adminJobCardList, getJobCardById, getCarsByUser, createJobCard, updateJobProgress, createJobService, getJobServicesByJob, deleteJobService, getJobMedia, deleteJobMedia, uploadJobMedia };
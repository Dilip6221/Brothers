const mongoose = require('mongoose');
const JOB_STAGES = [
  "CHECK_IN",
  "INSPECTION",
  "WORK_STARTED",
  "PART_REPLACED",
  "QUALITY_CHECK",
  "READY",
  "DELIVERED"
];

const ServiceJobsSchema = new mongoose.Schema(
  {
    jobCode: { type: String, unique: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    carId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserCars', required: true },
    status: {
      type: String,
      enum: ['PENDING', 'PROGRESS', 'COMPLETED', 'DELIVERED', 'CANCELLED'],
      default: 'PENDING',
      index: true
    },
    currentStage: {
      type: String,
      enum: JOB_STAGES,
      default: 'CHECK_IN',
      index: true
    },

    progressPercent: { type: Number, default: 0 },
    checkInTime: { type: Date, default: Date.now },
    expectedDelivery: { type: Date },
    timeline: [{ stage: String, status: String, note: String, updatedAt: { type: Date, default: Date.now } }],
    customerNotes: {type: String,default: ""},
    reel: {
      status: {
        type: String,
        enum: ["NOT_GENERATED", "PROCESSING", "READY", "FAILED"],
        default: "NOT_GENERATED",
        index: true,
      },
      template: {
        type: String,
        enum: ["CINEMATIC", "FAST", "LUXURY"],
        default: "CINEMATIC",
      },
      video: {
        url: {type: String, default: ""},
        publicId: {type: String, default: "",},
      },
      caption: {type: String,default: ""},
      duration: {type: Number,default: 0},
      mediaCount: {type: Number,default: 0},
      errorMessage: {type: String,default: ""},
      generatedAt: {type: Date,},
    },
  },
  { timestamps: true, versionKey: false }
);
const ServiceJobs = mongoose.model('ServiceJobs', ServiceJobsSchema);
module.exports = { ServiceJobs ,JOB_STAGES };

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
    customerNotes: String
  },
  { timestamps: true, versionKey: false }
);
const ServiceJobs = mongoose.model('ServiceJobs', ServiceJobsSchema);
module.exports = { ServiceJobs };

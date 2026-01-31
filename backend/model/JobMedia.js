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

const JobMediaSchema = new mongoose.Schema(
  {
    jobId: {type: mongoose.Schema.Types.ObjectId,ref: 'ServiceJobs',required: true,index: true},
    mediaType: {type: String,enum: ['photo', 'video'],required: true},
    stage: {type: String,enum: JOB_STAGES,required: true,index: true},
    publicId: { type: String, required: true },
    url: { type: String, required: true },
    uploadedBy: {type: mongoose.Schema.Types.ObjectId,ref: 'User'},
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true, versionKey: false }
);
const JobMedia = mongoose.model('JobMedia', JobMediaSchema);
module.exports = {JobMedia};
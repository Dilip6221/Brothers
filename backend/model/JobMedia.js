const mongoose = require('mongoose');

const JobMediaSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ServiceJobs',
      required: true,
      index: true
    },

    mediaType: {
      type: String,
      enum: ['photo', 'video'],
      required: true
    },
    stage: { type: String },
    publicId: { type: String, required: true },
    url: { type: String, required: true },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users'
    },

    isActive: { type: Boolean, default: true }
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model('JobMedia', JobMediaSchema);

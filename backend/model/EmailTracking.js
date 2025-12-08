const mongoose = require('mongoose');

const emailTrackingSchema = new mongoose.Schema({
  subscriberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "subscriptions",
    required: true
  },
  contentType: {
    type: String,
    enum: ["BLOG", "OFFER", "PRODUCT"],
    required: true
  },
  contentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  contentTitle: {
    type: String,
    required: true
  },
  mailSentAt: {
    type: Date,
    default: Date.now
  },
  isOpened: {
    type: Boolean,
    default: false
  },
  openedAt: {
    type: Date,
  },
  openCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

const EmailTracking = mongoose.model('EmailTracking', emailTrackingSchema);
module.exports = {EmailTracking};

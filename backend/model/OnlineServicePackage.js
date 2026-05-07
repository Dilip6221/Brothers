const mongoose = require("mongoose");

const onlineServicePackageSchema = new mongoose.Schema({
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "OnlineService",
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  features: [{
    type: String
  }],
  isPopular: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ["ACTIVE", "INACTIVE"],
    default: "ACTIVE"
  }
}, { timestamps: true });

module.exports = mongoose.model("OnlineServicePackage", onlineServicePackageSchema);
const mongoose = require("mongoose");
const onlineServiceAddonSchema = new mongoose.Schema({
  packageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "OnlineServicePackage",
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true
  },

  description: {
    type: String
  },

  isRequired: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ["ACTIVE", "INACTIVE"],
    default: "ACTIVE"
  }
}, { timestamps: true });

// prevent duplicate addon per package
onlineServiceAddonSchema.index({ packageId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("OnlineServiceAddon", onlineServiceAddonSchema);
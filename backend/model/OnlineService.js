const mongoose = require("mongoose");

const onlineServiceSchema = new mongoose.Schema({
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "OnlineServiceCategory",
    required: true,
    index: true
  },
  name: {type: String,required: true},
  slug: {type: String,required: true,unique: true,lowercase: true},
  image: String,
  description: String,
  status: {type: String,enum: ["ACTIVE", "INACTIVE"],default: "ACTIVE"}
}, { timestamps: true });

module.exports = mongoose.model("OnlineService", onlineServiceSchema);
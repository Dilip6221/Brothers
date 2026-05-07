const mongoose = require("mongoose");

const onlineServiceCategorySchema = new mongoose.Schema({
  name: {type: String,required: true,trim: true},
  slug: {type: String,required: true,unique: true,lowercase: true,index: true},
  icon: String,
  image: String,
  status: {type: String,enum: ["ACTIVE", "INACTIVE"],default: "ACTIVE",index: true},
  sortOrder: {type: Number,default: 0}
}, { timestamps: true });

module.exports = mongoose.model("OnlineServiceCategory", onlineServiceCategorySchema);
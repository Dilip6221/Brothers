const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema(
  {
    service: {type: String,required: true,trim: true,index: true},
    imageUrl: {type: String,required: true},
    publicId: {type: String,required: true,trim: true},
    title: {type: String,trim: true,default: ""},
    isActive: {type: Boolean,default: true},
  },
  { timestamps: true }
);
const Gallery = mongoose.model('Gallery', gallerySchema);
module.exports = { Gallery };
// const mongoose = require("mongoose");

// const gallerySchema = new mongoose.Schema(
//   {
//     service: {type: String,required: true,trim: true,index: true},
//     imageUrl: {type: String,required: true},
//     publicId: {type: String,required: true,trim: true},
//     title: {type: String,trim: true,default: ""},
//     isActive: {type: Boolean,default: true},
//   },
//   { timestamps: true }
// );
// const Gallery = mongoose.model('Gallery', gallerySchema);
// module.exports = { Gallery };



const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema(
  {
    service: {type: String,required: true,trim: true,index: true},
    type: {type: String,enum: ["SINGLE", "BEFORE_AFTER"],default: "SINGLE",index: true,},
    title: {type: String,trim: true,default: ""},
    imageUrl: {type: String,default: "",},
    publicId: {type: String,trim: true,default: "",},
    beforeImage: {
      url: {type: String,default: "",},
      publicId: {type: String,default: "",},
    },
    afterImage: {
      url: {type: String,default: "",},
      publicId: {type: String,default: "",},
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    isFeatured: {type: Boolean,default: false,index: true,},
    isActive: { type: Boolean,default: true,index: true,},
  },
  { timestamps: true }
);

const Gallery = mongoose.model("Gallery", gallerySchema);
module.exports = { Gallery };
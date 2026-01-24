const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    title: {type: String,required: true,trim: true},
    slug: {type: String,required: true,unique: true,lowercase: true,trim: true,index: true},
    shortDescription: {type: String,required: true,maxlength: 300 },
    description: {type: String,required: true },
    icon: {type: String},
    category: {type: String,index: true},
    duration: {type: String},
    metaTitle: {type: String,trim: true,maxlength: 60},
    metaDescription: {type: String,trim: true,maxlength: 160},
    metaKeywords: [{type: String,trim: true}],
    status: {type: String,enum: ["ACTIVE", "INACTIVE"],default: "ACTIVE",index: true},
  },
  {timestamps: true}
);

const Services = mongoose.model('Services',serviceSchema);
module.exports = { Services};
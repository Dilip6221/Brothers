const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    title: {type: String,required: true,trim: true},
    slug: {type: String,required: true,unique: true,lowercase: true,trim: true,index: true},
    shortDescription: {type: String,required: true,maxlength: 300 },
    description: {type: String,required: true },
    // ================= MEDIA =================
    icon: {type: String},
    image: {type: String},
    // ================= ORGANIZATION =================
    category: {type: String,index: true},
    duration: {type: String},
    // ================= PRICING =================
    price: { type: Number, default: 0 },
    discountPrice: {type: Number,default: 0}, 
    isPriceVisible: {type: Boolean,default: true},
    // ================= SEO =================
    metaTitle: {type: String,trim: true,maxlength: 60},
    metaDescription: {type: String,trim: true,maxlength: 160},
    metaKeywords: [{type: String,trim: true}],

    // ================= DISPLAY CONTROL =================
    isFeatured: {type: Boolean,default: false,},
    displayOrder: {type: Number,default: 0,},
    status: {type: String,enum: ["ACTIVE", "INACTIVE"],default: "ACTIVE",index: true},
  },
  {timestamps: true}
);

const Services = mongoose.model('Services',serviceSchema);
module.exports = { Services};
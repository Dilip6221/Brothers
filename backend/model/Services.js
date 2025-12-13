const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    shortDescription: {
      type: String,
      required: true,
      maxlength: 300,
    },

    description: {
      type: String,
      required: true,
    },

    // ================= MEDIA =================
    icon: {
      type: String, // icon class / emoji / svg url
    },

    image: {
      type: String, // banner image url
    },

    // ================= ORGANIZATION =================
    category: {
      type: String,
      index: true,
    },

    duration: {
      type: String, // e.g. "3–5 Days"
    },

    // ================= PRICING =================
    price: {
      type: Number,
      default: 0,
    },

    discountPrice: {
      type: Number,
      default: 0,
    },

    isPriceVisible: {
      type: Boolean,
      default: true,
    },

    // ================= SEO =================
    metaTitle: {
      type: String,
      trim: true,
    },

    metaDescription: {
      type: String,
      trim: true,
      maxlength: 160,
    },

    metaKeywords: [
      {
        type: String,
        trim: true,
      },
    ],

    // ================= DISPLAY CONTROL =================
    isFeatured: {
      type: Boolean,
      default: false,
    },

    showOnHome: {
      type: Boolean,
      default: false,
    },

    displayOrder: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const Services = mongoose.model('Services',serviceSchema);
module.exports = { Services};
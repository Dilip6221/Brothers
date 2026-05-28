// const mongoose = require('mongoose');

// const serviceSchema = new mongoose.Schema(
//   {
//     title: {type: String,required: true,trim: true},
//     slug: {type: String,required: true,unique: true,lowercase: true,trim: true,index: true},
//     shortDescription: {type: String,required: true,maxlength: 300 },
//     description: {type: String,required: true },
//     image: {
//       url: {type: String,required: true},
//       public_id: {type: String,required: true}
//     },
//     icon: {type: String},
//     category: {type: String,index: true},
//     duration: {type: String},
//     status: {type: String,enum: ["ACTIVE", "INACTIVE"],default: "ACTIVE",index: true},
//   },
//   {timestamps: true}
// );

// const Services = mongoose.model('Services',serviceSchema);
// module.exports = { Services};



const mongoose = require("mongoose");
const interactiveSectionSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true, default: "" },
    subtitle: { type: String, trim: true, default: "" },
    description: { type: String, default: "" },

    image: {
      url: { type: String, default: "" },
      public_id: { type: String, default: "" },
    },

    video: {
      url: { type: String, default: "" },
      public_id: { type: String, default: "" },
    },

    points: [{ type: String, trim: true }],

    stats: [
      {
        label: { type: String, default: "" },
        value: { type: String, default: "" },
      },
    ],
  },
  { _id: false }
);

const faqSchema = new mongoose.Schema(
  {
    question: { type: String, default: "" },
    answer: { type: String, default: "" },
  },
  { _id: false }
);

const packageSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    price: { type: String, default: "" },
    duration: { type: String, default: "" },
    features: [{ type: String, trim: true }],
    recommended: { type: Boolean, default: false },
  },
  { _id: false }
);

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

    image: {
      url: { type: String, required: true },
      public_id: { type: String, required: true },
    },

    cardFeatures: [{ type: String, trim: true }],

    icon: { type: String, default: "" },
    category: { type: String, default: "", index: true },
    duration: { type: String, default: "" },

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
      index: true,
    },

    displayOrder: {
      type: Number,
      default: 0,
      index: true,
    },

    featured: {
      type: Boolean,
      default: false,
    },

    heroTitle: { type: String, default: "" },
    heroSubtitle: { type: String, default: "" },
    heroVideo: {
      url: { type: String, default: "" },
      public_id: { type: String, default: "" },
    },

    interactiveSections: [interactiveSectionSchema],

    benefits: [{ type: String, trim: true }],

    packages: [packageSchema],

    faqs: [faqSchema],

    warranty: { type: String, default: "" },
  },
  { timestamps: true }
);

const Services = mongoose.model("Services", serviceSchema);

module.exports = { Services };
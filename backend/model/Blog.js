const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({

    title: {type: String,required: true},
    slug: {type: String,required: true,unique: true},
    thumbnail: {type: String,default: null},
    contentHTML: {type: String,required: true},
    category: {type: String,default: "General"},
    tags: [{type: String}],// Search keywords (car paint, wrap, ppf)
    metaTitle: {type: String,default: ""},
    metaDescription: {type: String, default: ""},
    status: {type: String,enum: ["DRAFT", "PUBLISHED", "ARCHIVED"],default: "DRAFT"},
    isMailSent: { type: Boolean, default: false },
    readTime: {type: Number,default: 0}, // in minutes
    likes: { type: Number, default: 0 },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    // commentCount: { type: Number, default: 0 }
}, {
    timestamps: true
});

blogSchema.pre("save", function (next) {
    if (!this.isModified("contentHTML")) return next();
    const text = this.contentHTML
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    const words = text.split(" ").length;
    this.readTime = Math.max(1, Math.ceil(words / 200));
    next();
});

const Blog = mongoose.model('Blog', blogSchema);
module.exports = {Blog};

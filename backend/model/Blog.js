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
    status: {type: String,enum: ["DRAFT", "PUBLISHED", "ARCHIVED"],default: "PUBLISHED"},
    createdAt: {type: Date,default: Date.now},
    updatedAt: {type: Date,default: null},
});

const Blog = mongoose.model('Blog', blogSchema);
module.exports = {Blog};

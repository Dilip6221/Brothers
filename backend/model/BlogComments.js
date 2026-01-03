const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  blogId: {type: mongoose.Schema.Types.ObjectId,ref: "Blog",required: true,index: true},
  userId: {type: mongoose.Schema.Types.ObjectId,ref: "User",required: true},
  text: {type: String,required: true,trim: true,maxlength: 300},
  likes: { type: Number, default: 0 },
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  parentId: {type: mongoose.Schema.Types.ObjectId,ref: "BlogComment",default: null,index: true},
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("BlogComment", commentSchema);

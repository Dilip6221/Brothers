const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    name: { type: String, required: true },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null, // guest user ke liye
    },
    // car: { type: String },
    // service: {
    //     type: String,
    //     enum: ["PPF", "Ceramic", "Detailing", "Wrapping", "Other"],
    //     required: true,
    // },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    review: {
        type: String, required: true,
    },
    isApproved: { type: Boolean, default: false },
}, { timestamps: true });

const CustomerReview = mongoose.model('CustomerReview', reviewSchema);
module.exports = { CustomerReview };
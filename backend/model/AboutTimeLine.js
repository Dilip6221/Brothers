const mongoose = require("mongoose");
const timelineSchema = new mongoose.Schema({
    year: {type: String,required: true},
    title: {type: String,required: true},
    description: {type: String,required: true},
    images: [
        {
            url: { type: String, required: true },
            public_id: { type: String, required: true }
        }
    ],
    order: {type: Number,default: 0},
    status: {
        type: String,
        enum: ["ACTIVE", "INACTIVE"],
        default: "ACTIVE"
    }
}, {
    timestamps: true
});
const AboutTimeLine = mongoose.model("AboutTimeLine", timelineSchema);
module.exports = { AboutTimeLine };
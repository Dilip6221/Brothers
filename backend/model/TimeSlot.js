const timeSlotSchema = new mongoose.Schema({
  time: {
    type: String,
    required: true // "10:00 AM"
  },
  startTime: String, // optional (ISO format later use)
  endTime: String,
  maxBooking: {
    type: Number,
    required: true,
    default: 5
  },
  status: {
    type: String,
    enum: ["ACTIVE", "INACTIVE"],
    default: "ACTIVE"
  }
}, { timestamps: true });

module.exports = mongoose.model("TimeSlot", timeSlotSchema);
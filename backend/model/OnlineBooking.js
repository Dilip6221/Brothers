const onlineBookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "OnlineServiceCategory"
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "OnlineService",
    required: true
  },
  packageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "OnlineServicePackage",
    required: true
  },
  addons: [
    {
      addonId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "OnlineServiceAddon"
      },
      name: String,
      price: Number
    }
  ],
  date: {
    type: String,
    required: true
  },
  slot: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true,
    index: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ["PENDING", "PAID", "FAILED"],
    default: "PENDING"
  },
  status: {
    type: String,
    enum: [
      "PENDING",
      "CONFIRMED",
      "ASSIGNED",
      "IN_PROGRESS",
      "COMPLETED",
      "CANCELLED"
    ],
    default: "PENDING",
    index: true
  } 
}, { timestamps: true });

module.exports = mongoose.model("OnlineBooking", onlineBookingSchema);
const mongoose = require('mongoose');
const UserCarsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    brand: { type: String, required: true, trim: true },
    model: { type: String, required: true, trim: true },
    year: { type: Number, required: true },
    color: { type: String, trim: true },
    registrationNumber: {
      type: String,
      required: true,
      uppercase: true,
      index: true
    },
    vinNumber: { type: String, trim: true },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true, versionKey: false }
);
const UserCars = mongoose.model('UserCars', UserCarsSchema);
module.exports = { UserCars };
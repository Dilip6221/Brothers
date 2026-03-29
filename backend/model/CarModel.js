const mongoose = require('mongoose');

const CarModelSchema = new mongoose.Schema({
    companyId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'CarCompany', 
    required: true 
  },
  name: { type: String, required: true },
  slug: String,
  code: { type: String, unique: true },
  bodyType: String,
//   launchYear: Number,
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const CarModel = mongoose.model('CarModel', CarModelSchema);
module.exports = { CarModel };
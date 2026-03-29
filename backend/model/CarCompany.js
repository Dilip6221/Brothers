const mongoose = require('mongoose');

const CarCompanySchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, unique: true },
    code: { type: String, unique: true },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

const CarCompany = mongoose.model('CarCompany', CarCompanySchema);
module.exports = { CarCompany };
const mongoose = require('mongoose');

const InquirySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    name: String,
    phone: String,
    email: String,
    city: String,
    carBrand: String,
    carModel: String,
    services: [String],
    address: String,
    notes: String,
    createdAt: { type: Date, default: Date.now }
});

const Inquery = mongoose.model('Inquiry', InquirySchema);
module.exports = Inquery;

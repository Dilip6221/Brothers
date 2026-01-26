const mongoose = require('mongoose');

const JobServicesSchema = new mongoose.Schema(
  {
    jobId: {type: mongoose.Schema.Types.ObjectId,ref: 'ServiceJobs',required: true,index: true},
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Services'
    },
    packageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ServicePackages'
    },
    serviceName: String,
    packageName: String,
    price: { type: Number, required: true },
    productsUsed: [
      {
        brand: String,
        productName: String,
        warrantyYears: Number,
        appliedOn: [String]
      }
    ],
    warranty: {
      startDate: Date,
      endDate: Date,
      warrantyCardUrl: String
    }
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model('JobServices', JobServicesSchema);

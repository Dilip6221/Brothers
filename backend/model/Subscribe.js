const mongoose = require('mongoose');

const SubscriptionSubscription = new mongoose.Schema({
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    status : {type:String,enum:['SUBSCRIBE','UNSUBSCRIBE'],default:'SUBSCRIBE'}

},{timestamps:true,versionKey: false});

const Subscription = mongoose.model('Subscription',SubscriptionSubscription);

module.exports = { Subscription};

// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// const nodemailer = require('nodemailer');

// const UserSchema = new mongoose.Schema({
//     name: { type: String, required: true},
//     email: { type: String, required: true, unique: true, lowercase: true, trim: true },
//     password: { type: String, required: true },
//     phone: {type:String,required:true},
//     role: {type:String,enum:['ADMIN','STAFF','USER'],default:'USER'},
//     isVerified: {type:Boolean,default:false},
//     resetPasswordTokenHash : {type: String},
//     resetPasswordTokenExpire : {type: Date},
//     status : {type:String,enum:['ACTIVE','INACTIVE'],default:'ACTIVE'}
// },{timestamps:true,versionKey: false});

// UserSchema.pre('save', async function(next) {
//     if (!this.isModified('password')) return next();
//     this.password = await bcrypt.hash(this.password, 10);
//     next();
// });
// UserSchema.methods.comparePassword = function(password) {
//     return bcrypt.compare(password, this.password);
// };
// const User = mongoose.model('User',UserSchema);

// const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//         user: process.env.SMTP_USER,
//         pass: process.env.SMTP_PASSWORD,
//     },
// });
// module.exports = { User, transporter};
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

const UserSchema = new mongoose.Schema({
    name: { type: String, trim: true },
    email: { 
        type: String, 
        lowercase: true, 
        trim: true,
        sparse: true,
        unique: true
    },
    phone: { 
        type: String, 
        required: true, 
        unique: true,
        index: true
    },
    role: {
        type: String,
        enum: ['ADMIN','STAFF','USER'],
        default: 'USER'
    },
    isProfileComplete: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['ACTIVE','BLOCKED'],
        default: 'ACTIVE'
    },
    lastLoginAt: { type: Date },
    loginCount: { type: Number, default: 0 }
}, { timestamps: true, versionKey: false });

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});
const User = mongoose.model('User',UserSchema);
module.exports = {User, transporter};
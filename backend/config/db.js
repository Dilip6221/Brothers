// const mongoose = require('mongoose');

// function connectDB() {
//     const mongoURI = process.env.MONGO_URI; 
//     mongoose.connect(mongoURI, {
//         dbName: "garage"
//     }).then(() => {
//         console.log('MongoDB connected successfully');
//     }).catch((err) => {
//         console.error('MongoDB connection error:', err);
//     }   );
// }
// module.exports = connectDB;


const mongoose = require('mongoose');

async function connectDB() {
    try {
        const mongoURI = process.env.MONGO_URI;
        await mongoose.connect(mongoURI, {
            dbName: "garage"
        });
        console.log("✅ MongoDB connected successfully");
    } catch (err) {
        console.error("❌ MongoDB connection error:", err);
        process.exit(1);
    }
}

module.exports = connectDB;
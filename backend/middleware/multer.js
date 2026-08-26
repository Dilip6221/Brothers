// const multer = require("multer");
// const storage = multer.memoryStorage();

// const upload = multer({
//   storage,
//   limits: {
//     fileSize: 5 * 1024 * 1024, // 5MB
//   },
//   fileFilter: (req, file, cb) => {
//     if (!file.mimetype.startsWith("image/")) {
//       cb(new Error("Only images are allowed"), false);
//     }
//     cb(null, true);
//   },
// });

// module.exports = { upload };



const multer = require("multer");
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024,
    files: 5,
  },
  fileFilter: (req, file, callback) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm'];
    if (!allowedTypes.includes(file.mimetype)) {
      return callback(new Error('Only JPG, PNG, WEBP, MP4 and WEBM files are allowed'));
    }
    callback(null, true);
  },
});

module.exports = {upload};

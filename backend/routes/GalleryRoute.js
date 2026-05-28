// const express = require("express");
// const router = express.Router();

// const { uploadGalleryImage, getGalleryImages, deleteGalleryImage} = require("../controller/GalleryController");
// const { upload } = require("../middleware/multer");
// const { authUser, authAdminRole} = require('../middleware/auth');

// router.post("/admin/upload", authAdminRole, upload.single("file"), uploadGalleryImage);
// router.get("/gallery", getGalleryImages);
// router.delete("/admin/:id", authAdminRole, deleteGalleryImage);

// module.exports = router;



const express = require("express");
const router = express.Router();

const {uploadGalleryImage,getGalleryImages,deleteGalleryImage} = require("../controller/GalleryController");
const { upload } = require("../middleware/multer");
const { authAdminRole } = require("../middleware/auth");
router.post("/admin/upload",
  authAdminRole,
  upload.fields([
    { name: "file", maxCount: 1 },
    { name: "beforeImage", maxCount: 1 },
    { name: "afterImage", maxCount: 1 },
  ]),
  uploadGalleryImage
);
router.get("/gallery", getGalleryImages);
router.delete("/admin/:id", authAdminRole, deleteGalleryImage);

module.exports = router;
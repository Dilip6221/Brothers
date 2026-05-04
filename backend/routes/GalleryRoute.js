const express = require("express");
const router = express.Router();

const { uploadGalleryImage, getGalleryImages, deleteGalleryImage} = require("../controller/GalleryController");
const { upload } = require("../middleware/multer");
const { authUser } = require('../middleware/auth');

router.post("/admin/upload", authUser, upload.single("file"), uploadGalleryImage);
router.get("/gallery", getGalleryImages);
router.delete("/admin/:id", authUser, deleteGalleryImage);

module.exports = router;

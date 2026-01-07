const express = require("express");
const router = express.Router();

const { uploadGalleryImage, getGalleryImages, deleteGalleryImage} = require("../controller/GalleryController");
const { upload } = require("../middleware/multer");

router.post("/admin/upload", upload.single("file"), uploadGalleryImage);
router.get("/gallery", getGalleryImages);
router.delete("/admin/:id", deleteGalleryImage);

module.exports = router;

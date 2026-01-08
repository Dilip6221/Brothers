const cloudinary = require("../config/cloudinary");
const { Gallery } = require("../model/Gallery.js");


// Upload Image Controller via admin panel
// router.post("/admin/upload", upload.single("image"), uploadGalleryImage);
const uploadGalleryImage = async (req, res) => {
  const { service, title } = req.body;
  if (!service) {
    return res.json({success: false,message: "Service is required" });
  }
  try {
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: `gallery/${service}`,
        },
        (error, result) => {
          if (error) reject(error);
          resolve(result);
        }
      ).end(req.file.buffer);
    });
    const gallery = await Gallery.create({
      service,
      title: title || "",
      imageUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    });
    res.json({success: true,message: "Image uploaded successfully",data: gallery});
  } catch (error) {
    console.error("Gallery upload error:", error);
    res.json({success: false,message: "Image upload failed" });
  }
};
// Get Gallery Images with Pagination
// router.get("/gallery", getGalleryImages);
const getGalleryImages = async (req, res) => {
  try {
    const { service } = req.query;
    const filter = { isActive: true };
    if (service) filter.service = service;

    const images = await Gallery.find(filter).sort({ createdAt: -1 });
    res.json({
      success: true,
      data: images,
    });
  } catch (error) {
    console.error("Gallery fetch error:", error);
    res.json({
      success: false,
      message: "Failed to fetch gallery",
    });
  }
};
const deleteGalleryImage = async (req, res) => {
  const { id } = req.params;
  try {
    const image = await Gallery.findById(id);
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }
    await cloudinary.uploader.destroy(image.publicId);
    await Gallery.findByIdAndDelete(id);
    res.json({success: true,message: "Image deleted successfully"});
  } catch (error) {
    console.error("Gallery delete error:", error);
    res.json({success: false,message: "Failed to delete image" });
  }
};


module.exports = { uploadGalleryImage, getGalleryImages, deleteGalleryImage };
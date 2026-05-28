// const cloudinary = require("../config/cloudinary");
// const { Gallery } = require("../model/Gallery.js");


// // Upload Image Controller via admin panel
// // router.post("/admin/upload", upload.single("image"), uploadGalleryImage);
// const uploadGalleryImage = async (req, res) => {
//   const { service, title } = req.body;
//   try {
//     const uploadResult = await new Promise((resolve, reject) => {
//       cloudinary.uploader.upload_stream(
//         {
//           folder: `gallery/${service}`,
//         },
//         (error, result) => {
//           if (error) reject(error);
//           resolve(result);
//         }
//       ).end(req.file.buffer);
//     });
//     const gallery = await Gallery.create({
//       service,
//       title: title || "",
//       imageUrl: uploadResult.secure_url,
//       publicId: uploadResult.public_id,
//     });
//     res.json({success: true,message: "Image uploaded successfully",data: gallery});
//   } catch (error) {
//     console.error("Gallery upload error:", error);
//     res.json({success: false,message: "Image upload failed" });
//   }
// };
// // Get Gallery Images with Pagination
// // router.get("/gallery", getGalleryImages);
// const getGalleryImages = async (req, res) => {
//   try {
//     const { service } = req.query;
//     const filter = { isActive: true };
//     if (service) filter.service = service;

//     const images = await Gallery.find(filter).sort({ createdAt: -1 });
//     res.json({success: true,data: images,});
//   } catch (error) {
//     console.error("Gallery fetch error:", error);
//     res.json({success: false,message: "Failed to fetch gallery",});
//   }
// };
// const deleteGalleryImage = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const image = await Gallery.findById(id);
//     if (!image) {
//       return res.status(404).json({ message: "Image not found" });
//     }
//     await cloudinary.uploader.destroy(image.publicId);
//     await Gallery.findByIdAndDelete(id);
//     res.json({success: true,message: "Image deleted successfully"});
//   } catch (error) {
//     console.error("Gallery delete error:", error);
//     res.json({success: false,message: "Failed to delete image" });
//   }
// };


// module.exports = { uploadGalleryImage, getGalleryImages, deleteGalleryImage };



const cloudinary = require("../config/cloudinary");
const { Gallery } = require("../model/Gallery.js");
const uploadToCloudinary = (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder }, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      })
      .end(fileBuffer);
  });
};

const uploadGalleryImage = async (req, res) => {
  try {
    const {service,title,type = "SINGLE",description = "",isFeatured = false} = req.body;
    if (!service) {
      return res.json({ success: false, message: "Service is required" });
    }
    if (!["SINGLE", "BEFORE_AFTER"].includes(type)) {
      return res.json({ success: false, message: "Invalid gallery type" });
    }
    let galleryData = {service,title: title || "",type,description,isFeatured: isFeatured === "true" || isFeatured === true};
    if (type === "SINGLE") {
      const file = req.files?.file?.[0];
      if (!file) {
        return res.json({ success: false, message: "Image is required" });
      }
      const uploadResult = await uploadToCloudinary(
        file.buffer,
        `gallery/${service}/single`
      );
      galleryData.imageUrl = uploadResult.secure_url;
      galleryData.publicId = uploadResult.public_id;
    }
    if (type === "BEFORE_AFTER") {
      const beforeFile = req.files?.beforeImage?.[0];
      const afterFile = req.files?.afterImage?.[0];

      if (!beforeFile || !afterFile) {
        return res.json({
          success: false,
          message: "Before and After images are required",
        });
      }
      const beforeUpload = await uploadToCloudinary(
        beforeFile.buffer,
        `gallery/${service}/before-after`
      );
      const afterUpload = await uploadToCloudinary(
        afterFile.buffer,
        `gallery/${service}/before-after`
      );
      galleryData.beforeImage = {
        url: beforeUpload.secure_url,
        publicId: beforeUpload.public_id,
      };
      galleryData.afterImage = {
        url: afterUpload.secure_url,
        publicId: afterUpload.public_id,
      };
    }
    const gallery = await Gallery.create(galleryData);
    res.json({success: true,message: "Gallery item uploaded successfully"});
  } catch (error) {
    console.error("Gallery upload error:", error);
    res.json({ success: false, message: "Gallery upload failed" });
  }
};

const getGalleryImages = async (req, res) => {
  try {
    const { service, type, featured } = req.query;
    const filter = { isActive: true };
    if (service) filter.service = service;
    if (type) filter.type = type;
    if (featured === "true") filter.isFeatured = true;
    const images = await Gallery.find(filter).sort({ createdAt: -1 });
    res.json({success: true,data: images,});
  } catch (error) {
    console.error("Gallery fetch error:", error);
    res.json({success: false,message: "Failed to fetch gallery",});
  }
};
const deleteGalleryImage = async (req, res) => {
  try {
    const { id } = req.params;
    const image = await Gallery.findById(id);
    if (!image) {
      return res.status(404).json({success: false, message: "Image not found",});
    }
    if (image.type === "SINGLE") {
      if (image.publicId) {
        await cloudinary.uploader.destroy(image.publicId);
      }
    }
    if (image.type === "BEFORE_AFTER") {
      if (image.beforeImage?.publicId) {
        await cloudinary.uploader.destroy(image.beforeImage.publicId);
      }
      if (image.afterImage?.publicId) {
        await cloudinary.uploader.destroy(image.afterImage.publicId);
      }
    }
    await Gallery.findByIdAndDelete(id);

    res.json({success: true,message: "Gallery item deleted successfully"});
  } catch (error) {
    console.error("Gallery delete error:", error);
    res.json({success: false,message: "Failed to delete image" });
  }
};

module.exports = {
  uploadGalleryImage,
  getGalleryImages,
  deleteGalleryImage,
};
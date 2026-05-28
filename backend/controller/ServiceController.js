const { Services } = require("../model/Services.js");
const cloudinary = require("../config/cloudinary");
const slugify = require("slugify");

const parseJSON = (value, fallback) => {
  try {
    if (!value) return fallback;

    if (typeof value === "string") {
      return JSON.parse(value);
    }

    return value;
  } catch {
    return fallback;
  }
};

const uploadToCloudinary = (
  fileBuffer,
  folder = "services",
  resourceType = "image"
) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    stream.end(fileBuffer);
  });
};



// ========================= CREATE / UPDATE SERVICE =========================

const createService = async (req, res) => {
  try {
    const {
      id,
      title,
      shortDescription,
      description,
      icon,
      category,
      duration,
      status,
      displayOrder,
      heroTitle,
      heroSubtitle,
      heroVideo,
      warranty,
      featured,
    } = req.body;

    if (!title || !shortDescription || !description) {
      return res.json({
        success: false,
        message: "Required fields missing",
      });
    }

    const slug = slugify(title, {
      lower: true,
      strict: true,
    });

    const existingSlug = await Services.findOne({
      slug,
      ...(id ? { _id: { $ne: id } } : {}),
    });

    if (existingSlug) {
      return res.json({
        success: false,
        message: "Service slug already exists",
      });
    }

    // ================= PARSE JSON =================

    const cardFeatures = parseJSON(req.body.cardFeatures, []);
    const benefits = parseJSON(req.body.benefits, []);
    const packages = parseJSON(req.body.packages, []);
    const faqs = parseJSON(req.body.faqs, []);
    const interactiveSections = parseJSON(
      req.body.interactiveSections,
      []
    );

    const parsedHeroVideo = parseJSON(heroVideo, {
      url: "",
      public_id: "",
    });

    // ================= MAIN IMAGE =================

    let imageData = null;

    if (req.file) {
      const uploadResult = await uploadToCloudinary(
        req.file.buffer,
        "services"
      );

      imageData = {
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
      };
    }

    // ================= UPDATE =================

    if (id) {
      const service = await Services.findById(id);

      if (!service) {
        return res.json({
          success: false,
          message: "Service not found",
        });
      }

      service.title = title;
      service.slug = slug;
      service.shortDescription = shortDescription;
      service.description = description;
      service.icon = icon || "";
      service.category = category || "";
      service.duration = duration || "";
      service.status = status || "ACTIVE";
      service.displayOrder = Number(displayOrder || 0);

      service.heroTitle = heroTitle || "";
      service.heroSubtitle = heroSubtitle || "";
      service.heroVideo = parsedHeroVideo;

      service.cardFeatures = cardFeatures;
      service.benefits = benefits;
      service.packages = packages;
      service.faqs = faqs;
      service.interactiveSections = interactiveSections;

      service.warranty = warranty || "";
      service.featured = featured === "true" || featured === true;

      if (imageData) {
        if (service.image?.public_id) {
          await cloudinary.uploader.destroy(service.image.public_id);
        }

        service.image = imageData;
      }

      await service.save();

      return res.json({
        success: true,
        message: "Service updated successfully",
        data: service,
      });
    }

    // ================= CREATE =================

    if (!imageData) {
      return res.json({
        success: false,
        message: "Service image required",
      });
    }

    const service = await Services.create({
      title,
      slug,
      shortDescription,
      description,

      image: imageData,

      icon: icon || "",
      category: category || "",
      duration: duration || "",

      status: status || "ACTIVE",
      displayOrder: Number(displayOrder || 0),

      heroTitle: heroTitle || "",
      heroSubtitle: heroSubtitle || "",
      heroVideo: parsedHeroVideo,

      cardFeatures,
      benefits,
      packages,
      faqs,
      interactiveSections,

      warranty: warranty || "",

      featured: featured === "true" || featured === true,
    });

    return res.json({
      success: true,
      message: "Service created successfully",
      data: service,
    });
  } catch (error) {
    console.log("Create Service Error:", error);

    return res.json({
      success: false,
      message: "Something went wrong",
    });
  }
};



// ================= GET ALL SERVICES =================

const getAllInquiries = async (req, res) => {
  try {
    const services = await Services.find().sort({
      displayOrder: 1,
      createdAt: -1,
    });

    return res.json({
      success: true,
      data: services,
    });
  } catch (error) {
    console.log(error);

    return res.json({
      success: false,
      message: error.message,
    });
  }
};



// ================= GET SINGLE SERVICE =================

const getSlugService = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Services.findOne({
      $or: [
        {
          _id: id.match(/^[0-9a-fA-F]{24}$/)
            ? id
            : undefined,
        },
        {
          slug: id,
        },
      ],
    });

    if (!service) {
      return res.json({
        success: false,
        message: "Service not found",
      });
    }

    return res.json({
      success: true,
      data: service,
    });
  } catch (error) {
    console.log(error);

    return res.json({
      success: false,
      message: error.message,
    });
  }
};



// ================= UPDATE STATUS =================

const updateServiceStatus = async (req, res) => {
  try {
    const { serviceId, status } = req.body;

    if (!serviceId || !status) {
      return res.json({
        success: false,
        message: "All fields required",
      });
    }

    const updatedService = await Services.findByIdAndUpdate(
      serviceId,
      { status },
      { new: true }
    );

    if (!updatedService) {
      return res.json({
        success: false,
        message: "Service not found",
      });
    }

    return res.json({
      success: true,
      message: `Service status changed to ${status}`,
    });
  } catch (error) {
    console.log(error);

    return res.json({
      success: false,
      message: "Something went wrong",
    });
  }
};



// ================= DELETE SERVICE =================

const deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Services.findById(id);

    if (!service) {
      return res.json({
        success: false,
        message: "Service not found",
      });
    }

    // delete main image

    if (service.image?.public_id) {
      await cloudinary.uploader.destroy(
        service.image.public_id
      );
    }

    // delete hero video

    if (service.heroVideo?.public_id) {
      await cloudinary.uploader.destroy(
        service.heroVideo.public_id,
        {
          resource_type: "video",
        }
      );
    }

    // delete interactive section images/videos

    for (const item of service.interactiveSections || []) {
      if (item.image?.public_id) {
        await cloudinary.uploader.destroy(
          item.image.public_id
        );
      }

      if (item.video?.public_id) {
        await cloudinary.uploader.destroy(
          item.video.public_id,
          {
            resource_type: "video",
          }
        );
      }
    }

    await Services.findByIdAndDelete(id);

    return res.json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error) {
    console.log(error);

    return res.json({
      success: false,
      message: "Delete failed",
    });
  }
};



// ================= MEDIA UPLOAD =================

const uploadServiceMedia = async (req, res) => {
  try {
    const { mediaType } = req.body;

    if (!req.file) {
      return res.json({
        success: false,
        message: "File required",
      });
    }

    const isVideo = mediaType === "video";

    const uploadResult = await uploadToCloudinary(
      req.file.buffer,
      isVideo
        ? "services/videos"
        : "services/images",
      isVideo ? "video" : "image"
    );

    return res.json({
      success: true,
      data: {
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
      },
    });
  } catch (error) {
    console.log(error);

    return res.json({
      success: false,
      message: "Media upload failed",
    });
  }
};



module.exports = {
  createService,
  getAllInquiries,
  getSlugService,
  updateServiceStatus,
  deleteService,
  uploadServiceMedia,
};
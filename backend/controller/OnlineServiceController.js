// controllers/admin/online-service.controller.js

const OnlineServiceCategory = require("../model/OnlineServiceCategory");
const OnlineService = require("../model/OnlineService");
const OnlineServicePackage = require("../model/OnlineServicePackage");
const OnlineServiceAddon = require("../model/OnlineServiceAddon");

const slugify = require("../utils/slugify");

// Create a new category
const createCategory = async (req, res) => {
  try {
    const { name, icon, image, sortOrder } = req.body;
    if (!name || !name.trim()) {
      return res.json({ success: false, message: "Name is required" });
    }

    const slug = slugify(name);
    const exists = await OnlineServiceCategory.findOne({ slug });
    if (exists) {
      return res.json({ success: false, message: "Category already exists" });
    }

    const category = await OnlineServiceCategory.create({ name, slug, icon, image, sortOrder });
    return res.json({ success: true, message: "Category created successfully", data: category });
  } catch (err) {
    console.error("createCategory error:", err);
    return res.json({ success: false, message: err.message });
  }
};

// List categories
const getCategories = async (req, res) => {
  try {
    const categories = await OnlineServiceCategory.find().sort({ sortOrder: 1, createdAt: -1 });
    return res.json({ success: true, data: categories });
  } catch (err) {
    console.error("getCategories error:", err);
    return res.json({ success: false, message: err.message });
  }
};

// Get single category by id
const getCategoryById = async (req, res) => {
  try {
    const category = await OnlineServiceCategory.findById(req.params.id);
    if (!category) return res.json({ success: false, message: "Category not found" });
    return res.json({ success: true, data: category });
  } catch (err) {
    console.error("getCategoryById error:", err);
    return res.json({ success: false, message: err.message });
  }
};

// Update category
const updateCategory = async (req, res) => {
  try {
    const { name, icon, image, status, sortOrder } = req.body;
    const updateData = { name, icon, image, status, sortOrder };
    if (name) updateData.slug = slugify(name);

    const category = await OnlineServiceCategory.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!category) return res.json({ success: false, message: "Category not found" });
    return res.json({ success: true, message: "Category updated", data: category });
  } catch (err) {
    console.error("updateCategory error:", err);
    return res.json({ success: false, message: err.message });
  }
};

// Delete category
const deleteCategory = async (req, res) => {
  try {
    const category = await OnlineServiceCategory.findByIdAndDelete(req.params.id);
    if (!category) return res.json({ success: false, message: "Category not found" });
    return res.json({ success: true, message: "Category deleted" });
  } catch (err) {
    console.error("deleteCategory error:", err);
    return res.json({ success: false, message: err.message });
  }
};

// ------------------ Services ------------------
// Create or update service (create if no id provided)
const createService = async (req, res) => {
  try {
    const { categoryId, name, image, description } = req.body;
    if (!categoryId || !name) {
      return res.json({ success: false, message: "categoryId and name are required" });
    }

    const category = await OnlineServiceCategory.findById(categoryId);
    if (!category) {
      return res.json({ success: false, message: "Invalid category" });
    }

    const slug = slugify(name);

    const exists = await OnlineService.findOne({ slug, categoryId });
    if (exists) {
      return res.json({ success: false, message: "Service already exists" });
    }

    const service = await OnlineService.create({
      categoryId,
      name,
      slug,
      image,
      description
    });
    return res.json({
      success: true,
      message: "Service created",
      data: service
    });
  } catch (err) {
    console.error(err);
    return res.json({ success: false, message: err.message });
  }
};

// Get services, optional filter by categoryId
const getServices = async (req, res) => {
  try {
    const { categoryId } = req.query;
    const filter = {};
    if (categoryId) filter.categoryId = categoryId;
    const services = await OnlineService.find(filter).populate("categoryId", "name").sort({ createdAt: -1 });
    return res.json({ success: true, data: services });
  } catch (err) {
    console.error("getServices error:", err);
    return res.json({ success: false, message: err.message });
  }
};

// Get single service
const getServiceById = async (req, res) => {
  try {
    const service = await OnlineService.findById(req.params.id).populate("categoryId", "name");
    if (!service) return res.json({ success: false, message: "Service not found" });
    return res.json({ success: true, data: service });
  } catch (err) {
    console.error("getServiceById error:", err);
    return res.json({ success: false, message: err.message });
  }
};

// Update service
const updateService = async (req, res) => {
  try {
    const { name, categoryId, image, description, status } = req.body;
    const updateData = { name, categoryId, image, description, status };
    if (name) updateData.slug = slugify(name);

    const service = await OnlineService.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!service) return res.json({ success: false, message: "Service not found" });
    return res.json({ success: true, message: "Service updated", data: service });
  } catch (err) {
    console.error("updateService error:", err);
    return res.json({ success: false, message: err.message });
  }
};

// Delete service
const deleteService = async (req, res) => {
  try {
    const service = await OnlineService.findByIdAndDelete(req.params.id);
    if (!service) return res.json({ success: false, message: "Service not found" });
    return res.json({ success: true, message: "Service deleted" });
  } catch (err) {
    console.error("deleteService error:", err);
    return res.json({ success: false, message: err.message });
  }
};


// ------------------ Packages ------------------

const createPackage = async (req, res) => {
  try {
    const { serviceId, name, price, duration, features } = req.body;
    if (!serviceId || !name || !price || !duration) {
      return res.json({ success: false, message: "Required fields missing" });
    }
    const service = await OnlineService.findById(serviceId);
    if (!service) {
      return res.json({ success: false, message: "Invalid service" });
    }
    const exists = await OnlineServicePackage.findOne({ serviceId, name });
    if (exists) {
      return res.json({ success: false, message: "Package already exists" });
    }
    const pkg = await OnlineServicePackage.create({
      serviceId,
      name,
      price,
      duration,
      features
    });
    res.json({success: true,message: "Package created"});
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: err.message });
  }
};

// GET PACKAGES (filter by serviceId)
const getPackages = async (req, res) => {
  try {
    const { serviceId } = req.query;
    let filter = {};
    if (serviceId) filter.serviceId = serviceId;

    const packages = await OnlineServicePackage.find(filter)
      .populate({
        path: "serviceId",
        select: "name",
        populate: {
          path: "categoryId",
          select: "name"
        }
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, data: packages });

  } catch (err) {
    console.error(err);
    res.json({ success: false, message: err.message });
  }
};


// GET SINGLE PACKAGE
const getPackageById = async (req, res) => {
  try {
    const pkg = await OnlineServicePackage.findById(req.params.id)
      .populate("serviceId", "name");
    if (!pkg) {
      return res.json({ success: false, message: "Package not found" });
    }
    res.json({ success: true, data: pkg });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: err.message });
  }
};

// UPDATE PACKAGE
const updatePackage = async (req, res) => {
  try {
    const { name, price, duration, features, status, serviceId } = req.body;
    let updateData = {
      name,
      price,
      duration,
      features,
      status,
      serviceId
    };
    if (name && serviceId) {
      const exists = await OnlineServicePackage.findOne({
        _id: { $ne: req.params.id },
        name,
        serviceId
      });
      if (exists) {
        return res.json({ success: false, message: "Package already exists" });
      }
    }
    const pkg = await OnlineServicePackage.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    if (!pkg) {
      return res.json({ success: false, message: "Package not found" });
    }
    res.json({success: true,message: "Package updated"});
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: err.message });
  }
};

const deletePackage = async (req, res) => {
  try {
    const pkg = await OnlineServicePackage.findByIdAndDelete(req.params.id);
    if (!pkg) {
      return res.json({ success: false, message: "Package not found" });
    }
    res.json({success: true,message: "Package deleted"});
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: err.message });
  }
};


const createAddon = async (req, res) => {
  try {
    const { packageId, name, price, description } = req.body;
    if (!packageId || !name || !price) {
      return res.json({ success: false, message: "Required fields missing" });
    }
    const pkg = await OnlineServicePackage.findById(packageId);
    if (!pkg) {
      return res.json({ success: false, message: "Invalid package" });
    }
    const exists = await OnlineServiceAddon.findOne({ packageId, name });
    if (exists) {
      return res.json({ success: false, message: "Addon already exists" });
    }
    const addon = await OnlineServiceAddon.create({
      packageId,
      name,
      price,
      description
    });
    res.json({ success: true, data: addon });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: err.message });
  }
};

// LIST
const getAddons = async (req, res) => {
  try {
    const { packageId } = req.query;
    let filter = {};
    if (packageId) filter.packageId = packageId;
    const addons = await OnlineServiceAddon.find(filter)
      .populate({
        path: "packageId",
        select: "name",
        populate: {
          path: "serviceId",
          select: "name"
        }
      })
      .sort({ createdAt: -1 });
    res.json({ success: true, data: addons });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: err.message });
  }
};

const getAddonById = async (req, res) => {
  try {
    const addon = await OnlineServiceAddon.findById(req.params.id)
      .populate("packageId", "name");

    if (!addon) {
      return res.json({ success: false, message: "Addon not found" });
    }
    res.json({ success: true, data: addon });

  } catch (err) {
    console.error(err);
    res.json({ success: false, message: err.message });
  }
};

// UPDATE
const updateAddon = async (req, res) => {
  try {
    const { name, price, description, status, packageId } = req.body;
    const exists = await OnlineServiceAddon.findOne({
      _id: { $ne: req.params.id },
      name,
      packageId
    });
    if (exists) {
      return res.json({ success: false, message: "Addon already exists" });
    }
    const addon = await OnlineServiceAddon.findByIdAndUpdate(
      req.params.id,
      { name, price, description, status, packageId },
      { new: true }
    );
    res.json({ success: true, data: addon });

  } catch (err) {
    console.error(err);
    res.json({ success: false, message: err.message });
  }
};

// DELETE
const deleteAddon = async (req, res) => {
  try {
    await OnlineServiceAddon.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Addon deleted" });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: err.message });
  }
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
  createPackage,
  getPackages,
  getPackageById,
  updatePackage,
  deletePackage,
  createAddon,
  getAddons,
  getAddonById,
  updateAddon,
  deleteAddon
};
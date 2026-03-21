const { Services } = require('../model/Services.js');
const cloudinary = require("../config/cloudinary");


// Create a new service in admin role
const express = require('express');
const router = express.Router();
const slugify = require('slugify');

// Create admin through the service
// serviceRoute.post('/admin/create', createService);
const createService = async (req, res) => {
  try {
    const {id, title, shortDescription, description, icon, category, duration, status } = req.body;
    if (!title || !shortDescription || !description) {
      return res.json({ success: false, message: 'Required fields missing' });
    }
    const slug = slugify(title, { lower: true, strict: true });
    const existingSlug = await Services.findOne({ slug, _id: { $ne: id } });
    if (existingSlug) {
      return res.json({ success: false, message: "Slug already exists. Please choose a different one." });
    }
    let imageData = null;
    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "services",
          },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        stream.end(req.file.buffer);
      });
      imageData = {
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
      };
    }

    let service;
    if (id) {
      service = await Services.findById(id);
      if (!service) {
        return res.json({ success: false, message: "Service not found for update" });
      }
      service.title = title;
      service.slug = slug;
      service.shortDescription = shortDescription;
      service.description = description;
      service.icon = icon;
      service.category = category;
      service.duration = duration;
      service.updatedAt = new Date();
      service.status = status;
      if (imageData) {
          if (service.image?.public_id) {
              await cloudinary.uploader.destroy(service.image.public_id);
          }
          service.image = imageData;
      }
      await service.save();
      return res.json({ success: true, message: "Service updated successfully!", data: service });
    } else {
      service = await Services.create({
        title,
        slug,
        shortDescription,
        description,
        icon,
        category,
        duration,
        status,
        image: imageData,
      });
      return res.json({ success: true, message: "Service created successfully!", data: service });
    }
  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: "Something went wrong" });
  }
};

// Get all service 
// serviceRoute.get('service/admin/services', getAllInquiries);
const getAllInquiries = async (req, res) => {
  try {
    const services = await Services.find().sort({ createdAt: -1 });
    res.json({ success: true, data: services });
  }
  catch (error) {
    console.error('Error in fetching all Services:', error);
    res.json({ success: false, message: error.message });
  }
};
// Get service by id or slug in admin and platform
// serviceRoute.get('/service/get-service/:id', getSlugService);
const getSlugService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Services.findOne({ _id: id });
    if (!service) {
      return res.json({ message: 'Service not found' });
    }
    res.json({ success: true, data: service });
  }
  catch (error) {
    console.error('Error in fetching Service by slug:', error);
    res.json({ success: false, message: error.message });
  }
};

const updateServiceStatus = async (req,res) =>  {
    try {
        const { serviceId, status } = req.body;
        if (!serviceId || !status) {          
            return res.json({success: false,message: "All fields are required",});
        }
        const updatedService = await Services.findByIdAndUpdate(serviceId,{ status },{ new: true });
        if (!updatedService) {
            return res.json({success: false,message: "Service not found"});
        }
        return res.json({success: true,message: `Service status changed to ${status}`,});
    } catch (error) {
        console.log(error);
        return res.json({success: false,message: "Something went wrong"});
    }
}

module.exports = { createService, getAllInquiries, getSlugService,updateServiceStatus };
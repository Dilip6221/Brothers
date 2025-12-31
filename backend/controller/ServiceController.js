const { Services } = require('../model/Services.js');

// Create a new service in admin role
const createService = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body; 
        const newInquiry = new Services({
            name,
            email,
            subject,
            message
        });
        await newInquiry.save();
        res.status(201).json({ message: 'Inquiry created successfully', inquiry: newInquiry });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }

};

// Get all service 
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
// Get service by slug
const getSlugService = async (req, res) => {
    try {   
        const { slug } = req.params;
        const service = await Services.findOne({ slug: slug });
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }
        res.json({ success: true, data: service });
    }
    catch (error) {
        console.error('Error in fetching Service by slug:', error);
        res.json({ success: false, message: error.message });
    }
};

module.exports = { createService, getAllInquiries,getSlugService};
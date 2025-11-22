const {Inquiry} = require("../model/Inquiery.js");
const { sendInqueryMail } = require("../mail/InquieryMail.js");

/* For Create Portal side service Inquiery request data */
const createServiceInquiry = async (req, res) => {
    try {
        let {
            name, phone, email, city,
            carBrand, carModel,
            services, address, notes
        } = req.body;
        if (req.user) {
            name = req.user.name;
            phone = req.user.phone;
            email = req.user.email;
        }

        if (!name || !phone || !email || !city || !carBrand || !carModel || !services || services.length === 0) {
            return res.json({ success: false, message: 'All fields are required' });
        }
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(phone)) {
            return res.json({ success: false, message: 'Please enter a valid phone number' });
        }
        const inquiry = await Inquiry.create({
            userId: req.user ? req.user._id : null,
            name,
            phone,
            email,
            city,
            carBrand,
            carModel,
            services,
            address,
            notes
        });
        res.json({success: true,message: "Your inquiry has been submitted. Our team will contact you soon."});

        await sendInqueryMail(inquiry);
    } catch (error) {
        console.error('Error in Service inquery form :', error);
        res.json({ success: false, message: error.message });
    }
};

/* For admin side display service inquery data  */
const adminInquiryData = async (req, res) => {
    try {
        const inquiries = await Inquiry.find().sort({ createdAt: -1 }); 
        res.json({ success: true, data: inquiries });
    } catch (error) {
        console.error('Error fetching inquiries:', error);
        res.json({ success: false, message: error.message });
    }  
};
// Get single inquiry data for view
const getInquiryDetails = async (req, res) => {
    try {
        const { id } = req.body;
        const inquiry = await Inquiry.findById(id);
        if (!inquiry) {
            return res.json({ success: false, message: "Inquiry not found" });
        }
        res.json({ success: true, data: inquiry });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
/* For admin side Customer Inquery export funtionaloioty */
const exportCustomerInqueryData = async (req, res) => {
    try {
        const { filter } = req.body;
        let query = {};
        if (filter === "PENDING") query.status = "PENDING";
        if (filter === "COMPLETED") query.status = "COMPLETED";
        if (filter === "ALL") query = {};
        const users = await Inquiry.find(query);
        let csv = "Full Name,Email,Phone,Brand,Model,Services,Status\n";
        users.forEach(u => {
            const services = Array.isArray(u.services) ? u.services.join(", "): u.services;
            csv += `"${u.name}","${u.email}","${u.phone}","${u.carBrand}","${u.carModel}","${services}","${u.status}"\n`;
        });
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", "attachment; filename=users.csv");
        res.send(csv);
    } catch (error) {
        res.status(500).json({ success: false, message: "CSV export failed" });
    }
};
module.exports = { createServiceInquiry,adminInquiryData,getInquiryDetails,exportCustomerInqueryData};
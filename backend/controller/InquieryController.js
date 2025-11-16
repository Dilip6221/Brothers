const Inquiry = require("../model/Inquiery.js");
const { sendInqueryMail } = require("../mail/InquieryMail.js");

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

module.exports = { createServiceInquiry };
const express = require("express");
const router = express.Router();
const { createServiceInquiry,adminInquiryData,getInquiryDetails,exportCustomerInqueryData } = require("../controller/InquieryController");
const { authOptional } = require("../middleware/auth.js");

router.post("/service-inquiry", authOptional, createServiceInquiry);
router.post("/admin/admin-inquery-data", adminInquiryData);
router.post("/admin/inquiry-details", getInquiryDetails);
router.post("/admin/inquiry-export", exportCustomerInqueryData);

module.exports = router;

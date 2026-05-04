const express = require("express");
const router = express.Router();
const { createServiceInquiry,adminInquiryData,getInquiryDetails,exportCustomerInqueryData } = require("../controller/InquieryController");
const { authOptional,authUser } = require("../middleware/auth.js");

router.post("/service-inquiry", authOptional, createServiceInquiry);
router.post("/admin/admin-inquery-data", authUser, adminInquiryData);
router.post("/admin/inquiry-details", authUser, getInquiryDetails);
router.post("/admin/inquiry-export", authUser, exportCustomerInqueryData);

module.exports = router;

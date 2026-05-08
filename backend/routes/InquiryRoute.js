const express = require("express");
const router = express.Router();
const { createServiceInquiry,adminInquiryData,getInquiryDetails,exportCustomerInqueryData } = require("../controller/InquieryController");
const { authOptional,authUser,authAdminRole } = require("../middleware/auth.js");

router.post("/service-inquiry", authOptional, createServiceInquiry);
router.post("/admin/admin-inquery-data", authAdminRole, adminInquiryData);
router.post("/admin/inquiry-details", authAdminRole, getInquiryDetails);
router.post("/admin/inquiry-export", authAdminRole, exportCustomerInqueryData);

module.exports = router;

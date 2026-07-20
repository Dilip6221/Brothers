const express = require("express");
const router = express.Router();
const { createServiceInquiry,adminInquiryData,getInquiryDetails,exportCustomerInqueryData, updateInquiryStatus } = require("../controller/InquieryController");
const { authOptional,authUser,authAdminRole } = require("../middleware/auth.js");

router.post("/service-inquiry", authOptional, createServiceInquiry);
router.post("/admin/admin-inquery-data", authAdminRole, adminInquiryData);
router.post("/admin/inquiry-details", authAdminRole, getInquiryDetails);
router.post("/admin/inquiry-export", authAdminRole, exportCustomerInqueryData);
router.post("/admin/update-inquiry", authAdminRole, updateInquiryStatus);

module.exports = router;

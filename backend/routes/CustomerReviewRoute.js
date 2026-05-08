const express = require("express");
const router = express.Router();
const { saveCustomerReview,getAllReviews,approveCustomerReview } = require("../controller/CustomerReviewController.js");
const { authUser,authAdminRole } = require('../middleware/auth');

router.post("/save-customer-review", saveCustomerReview);

router.get("/admin/all", getAllReviews);
router.put("/admin/approve/:id", authAdminRole, approveCustomerReview);


module.exports = router;

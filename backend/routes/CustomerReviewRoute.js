const express = require("express");
const router = express.Router();
const { saveCustomerReview,getAllReviews,approveCustomerReview } = require("../controller/CustomerReviewController.js");
const { authUser } = require('../middleware/auth');

router.post("/save-customer-review", saveCustomerReview);

router.get("/admin/all",authUser, getAllReviews);
router.put("/admin/approve/:id", authUser, approveCustomerReview);


module.exports = router;

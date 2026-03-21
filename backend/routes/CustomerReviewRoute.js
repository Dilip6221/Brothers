const express = require("express");
const router = express.Router();
const { saveCustomerReview,getAllReviews,approveCustomerReview } = require("../controller/CustomerReviewController.js");

router.post("/save-customer-review", saveCustomerReview);

router.get("/admin/all", getAllReviews);
router.put("/admin/approve/:id", approveCustomerReview);


module.exports = router;

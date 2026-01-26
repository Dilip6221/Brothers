const express = require("express");
const router = express.Router();
const { getUserCars,createUserCar,adminJobCardList,getJobCardById,getCarsByUser,createJobCard,updateJobProgress } = require("../controller/JobCardController.js");

router.post("/admin/user-cars",getUserCars );  // Listing for User Cars
router.post("/admin/user-cars/create",createUserCar );  // Create A User Cars

router.get("/admin/get-job-cards",adminJobCardList ); // Job Card listing
router.get("/admin/get-card/:id", getJobCardById); // Get A job card By Id
router.get("/admin/user-cars/:userId", getCarsByUser);  // Get A card By UserId
router.post("/admin/job-card/create", createJobCard);  // Create a job Job Card by admin
router.patch("/admin/jobcard/:id/progress", updateJobProgress);  // Update a job card via ID by admin

module.exports = router;

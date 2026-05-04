const express = require("express");
const router = express.Router();
const {upload} = require("../middleware/multer.js"); // multer middleware
const {authUser} = require('../middleware/auth');


const { getUserCars,createUserCar,adminJobCardList,getJobCardById,getCarsByUser,createJobCard,updateJobProgress,getJobServicesByJob,createJobService,deleteJobService,uploadJobMedia,getJobMedia, deleteJobMedia,getMyCars,getCustomerJobCard} = require("../controller/JobCardController.js");

router.post("/admin/user-cars",authUser, getUserCars );  // Listing for User Cars
router.post("/admin/user-cars/create",authUser, createUserCar );  // Create A User Cars

router.get("/admin/get-job-cards",authUser, adminJobCardList ); // Job Card listing
router.get("/admin/get-card/:id", authUser, getJobCardById); // Get A job card By Id
router.get("/admin/user-cars/:userId", authUser, getCarsByUser);  // Get A card By UserId
router.post("/admin/job-card/create", authUser, createJobCard);  // Create a job Job Card by admin
router.patch("/admin/jobcard/:id/progress", authUser, updateJobProgress);  // Update a job card via ID by admin

router.post("/admin/job-services/create", authUser, createJobService);
router.get("/admin/job-services/:jobId", authUser, getJobServicesByJob);
router.delete("/admin/job-services/:id", authUser, deleteJobService);

router.get("/admin/job-cards/:jobId/get-media", authUser, getJobMedia);
router.post("/admin/job-cards/:jobId/media",authUser, upload.single("media"),uploadJobMedia);
router.delete("/admin/job-cards/:jobId/media/:mediaId", authUser, deleteJobMedia);

/* Platfrom side route */
router.get("/customer/my-cars",authUser, getMyCars); // Get My Cars
router.get("/customer/job-card/:carId",authUser, getCustomerJobCard); // Get Customer Job Card


module.exports = router;

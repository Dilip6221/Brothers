const express = require("express");
const router = express.Router();
const {upload} = require("../middleware/multer.js"); // multer middleware
const {authUser, authAdminRole} = require('../middleware/auth');


const { getUserCars,createUserCar,adminJobCardList,getJobCardById,getCarsByUser,createJobCard,updateJobProgress,getJobServicesByJob,createJobService,deleteJobService,uploadJobMedia,getJobMedia, deleteJobMedia,getMyCars,getCustomerJobCard} = require("../controller/JobCardController.js");

router.post("/admin/user-cars",authAdminRole, getUserCars );  // Listing for User Cars
router.post("/admin/user-cars/create",authAdminRole, createUserCar );  // Create A User Cars

router.get("/admin/get-job-cards",authUser, adminJobCardList ); // Job Card listing
router.get("/admin/get-card/:id", authUser, getJobCardById); // Get A job card By Id
router.get("/admin/user-cars/:userId", authUser, getCarsByUser);  // Get A card By UserId
router.post("/admin/job-card/create", authAdminRole, createJobCard);  // Create a job Job Card by admin
router.patch("/admin/jobcard/:id/progress", authAdminRole, updateJobProgress);  // Update a job card via ID by admin

router.post("/admin/job-services/create", authAdminRole, createJobService);
router.get("/admin/job-services/:jobId", authUser, getJobServicesByJob);
router.delete("/admin/job-services/:id", authAdminRole, deleteJobService);

router.get("/admin/job-cards/:jobId/get-media", authUser, getJobMedia);
router.post("/admin/job-cards/:jobId/media",authAdminRole, upload.single("media"),uploadJobMedia);
router.delete("/admin/job-cards/:jobId/media/:mediaId", authAdminRole, deleteJobMedia);

/* Platfrom side route */
router.get("/customer/my-cars",authUser, getMyCars); // Get My Cars
router.get("/customer/job-card/:carId",authUser, getCustomerJobCard); // Get Customer Job Card


module.exports = router;

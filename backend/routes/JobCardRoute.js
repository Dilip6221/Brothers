const express = require("express");
const router = express.Router();
const {upload} = require("../middleware/multer.js"); // multer middleware

const { getUserCars,createUserCar,adminJobCardList,getJobCardById,getCarsByUser,createJobCard,updateJobProgress,getJobServicesByJob,createJobService,deleteJobService,uploadJobMedia,getJobMedia, deleteJobMedia} = require("../controller/JobCardController.js");

router.post("/admin/user-cars",getUserCars );  // Listing for User Cars
router.post("/admin/user-cars/create",createUserCar );  // Create A User Cars

router.get("/admin/get-job-cards",adminJobCardList ); // Job Card listing
router.get("/admin/get-card/:id", getJobCardById); // Get A job card By Id
router.get("/admin/user-cars/:userId", getCarsByUser);  // Get A card By UserId
router.post("/admin/job-card/create", createJobCard);  // Create a job Job Card by admin
router.patch("/admin/jobcard/:id/progress", updateJobProgress);  // Update a job card via ID by admin


router.post("/admin/job-services/create", createJobService);
router.get("/admin/job-services/:jobId", getJobServicesByJob);
router.delete("/admin/job-services/:id", deleteJobService);


router.get("/admin/job-cards/:jobId/get-media",getJobMedia);
router.post("/admin/job-cards/:jobId/media",upload.single("media"),uploadJobMedia);
router.delete("/admin/job-cards/:jobId/media/:mediaId",deleteJobMedia);

module.exports = router;

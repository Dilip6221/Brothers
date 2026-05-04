const express = require("express");
const router = express.Router();
const { upload } = require('../middleware/multer');
const { authUser } = require('../middleware/auth');
const { createTimeline, getTimeline, updateTimeline, deleteTimeline, getSingleTimeline, deleteTimelineImage } = require("../controller/AboutTimeLineController");

router.post("/admin/create-about-timeline", authUser, upload.array("images", 5), createTimeline); // For creating new timeline entry
router.put("/admin/update-about-timeline", authUser, upload.array("images", 5), updateTimeline); // For updating existing timeline entry
router.delete("/admin/delete-about-timeline/:id", authUser, deleteTimeline); // For deleting a timeline entry
router.get("/about-timeline", getTimeline); // For fetching all timeline entries (public route)
router.get("/about-timeline/:id", getSingleTimeline); // For fetching a single timeline entry by ID (public route)
router.post("/admin/delete-timeline-image", authUser, deleteTimelineImage); // For deleting a specific image from a timeline entry

module.exports = router;
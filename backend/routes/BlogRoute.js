const express = require("express");
const router = express.Router();
const { creteAdminBlog,displayBlog,showSlugWiseBlog,changeBlogStatus,likeBlogToggle } = require("../controller/BlogController");
const { upload } = require('../middleware/multer');
const { authUser } = require('../middleware/auth');

router.post("/admin/create-blog", authUser, upload.single("image"), creteAdminBlog);
router.post("/admin/blogs", displayBlog);
router.post("/admin/update-status", authUser, changeBlogStatus);
router.post("/like-toggle/:id", authUser, likeBlogToggle);
router.get("/blogs/:slug", showSlugWiseBlog);

module.exports = router;
``
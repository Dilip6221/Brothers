const express = require("express");
const router = express.Router();
const { creteAdminBlog,displayBlog,showSlugWiseBlog,changeBlogStatus,likeBlogToggle } = require("../controller/BlogController");
const { upload } = require('../middleware/multer');

router.post("/admin/create-blog",upload.single("image"), creteAdminBlog);
router.post("/admin/blogs", displayBlog);
router.post("/admin/update-status", changeBlogStatus);
router.post("/like-toggle/:id", likeBlogToggle);
router.get("/blogs/:slug", showSlugWiseBlog);

module.exports = router;

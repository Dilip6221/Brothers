const express = require("express");
const router = express.Router();
const { creteAdminBlog,displayBlog,showSlugWiseBlog,changeBlogStatus,likeBlogToggle } = require("../controller/BlogController");
const { upload } = require('../middleware/multer');
const { authUser,authAdminRole } = require('../middleware/auth');

router.post("/admin/create-blog", authAdminRole, upload.single("image"), creteAdminBlog);
router.post("/admin/blogs", authAdminRole, displayBlog);
router.post("/admin/update-status", authAdminRole, changeBlogStatus);
router.post("/like-toggle/:id", authUser, likeBlogToggle);
router.get("/blogs/:slug", showSlugWiseBlog);

module.exports = router;
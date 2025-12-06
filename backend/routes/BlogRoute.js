const express = require("express");
const router = express.Router();
const { creteAdminBlog,displayBlog,showSlugWiseBlog } = require("../controller/BlogController");

router.post("/admin/create-blog", creteAdminBlog);
router.post("/admin/blogs", displayBlog);
router.get("/blogs/:slug", showSlugWiseBlog);

module.exports = router;

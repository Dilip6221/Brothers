const { Blog } = require("../model/Blog.js");
const { Subscription } = require('../model/Subscribe.js');
const { EmailTracking } = require("../model/EmailTracking.js");
const { sendSubscribeMail } = require("../mail/BlogMail.js");
const cloudinary = require("../config/cloudinary");
const slugify = require('slugify');
const sanitizeHtml = require('sanitize-html');

const sanitizeBlogContent = (content = '') => sanitizeHtml(content, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
    allowedAttributes: {
        ...sanitizeHtml.defaults.allowedAttributes,
        img: ['src', 'alt', 'width', 'height'],
    },
    allowedSchemes: ['http', 'https'],
});

// Create Blog for admin side
//router.post("/admin/create-blog", creteAdminBlog);
const creteAdminBlog = async (req, res) => {
    try {
        const { id, title, content, category, tags, metaTitle, metaDescription } = req.body;
        let imageData = null;
        if (req.file) {
            const uploadResult = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        folder: "Blogs",
                    },
                    (error, result) => {
                        if (result) resolve(result);
                        else reject(error);
                    }
                );
                stream.end(req.file.buffer);
            });
            imageData = {
                url: uploadResult.secure_url,
                public_id: uploadResult.public_id,
            };
        }
        const slug = slugify(title, { lower: true, strict: true });
        const existingSlug = await Blog.findOne({ slug, _id: { $ne: id } });
        if (existingSlug) {
            return res.json({ success: false, message: "Slug already exists. Please choose a different one." });
        }
        let blog;
        if (id) {
            // Update existing blog
            blog = await Blog.findById(id);
            if (!blog) {
                return res.json({ success: false, message: "Blog not found for update" });
            }
            blog.title = title;
            blog.slug = slug;
            blog.contentHTML = sanitizeBlogContent(content);
            blog.category = category;
            blog.tags = tags;
            blog.metaTitle = metaTitle;
            blog.metaDescription = metaDescription;
            blog.updatedAt = new Date();
            if (imageData) {
                if (blog.thumbnail?.public_id) {
                    await cloudinary.uploader.destroy(blog.thumbnail.public_id);
                }
                blog.thumbnail = imageData;
            }
            await blog.save();
            return res.json({ success: true, message: "Blog updated successfully!", data: blog });
        } else {
            if (!imageData) {
                return res.json({ success: false, message: "Thumbnail image is required" });
            }
            blog = await Blog.create({
                title,
                slug,
                contentHTML: sanitizeBlogContent(content),
                category,
                tags,
                metaTitle,
                metaDescription,
                thumbnail: imageData,
            });
            return res.json({ success: true, message: "Blog created successfully!", data: blog });
        }
    } catch (error) {
        console.error(error);
        return res.json({ success: false, message: "Something went wrong" });
    }
};

/* For display all blog in admin side */
/* router.post("/admin/blogs", displayBlog); */
const displayBlog = async (req, res) => {
    try {
        const blogs = await Blog.find().select('id title slug category metaDescription views likedBy likes readTime thumbnail tags status createdAt').sort({ createdAt: -1 });
        res.json({ success: true, data: blogs });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Something went wrong" });
    }
};

const displayPublishedBlogs = async (req, res) => {
    try {
        const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
        const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 12, 1), 50);
        const blogs = await Blog.find({ status: "PUBLISHED" })
            .select("title slug category metaTitle metaDescription readTime thumbnail tags createdAt updatedAt")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean();
        res.json({ success: true, data: blogs, page, limit });
    } catch (error) {
        console.error("Published blogs error:", error);
        res.status(500).json({ success: false, message: "Unable to load blogs" });
    }
};

//  Get Single Blog via Slug aur id
//router.get("/blogs/:slug", displayBlog);
const showSlugWiseBlog = async (req, res) => {
    const value = req.params.slug;
    let findCondition = {};
    if (value.match(/^[0-9a-fA-F]{24}$/)) {
        findCondition = { _id: value };
    } else {
        findCondition = { slug: value };
    }
    if (findCondition.slug) findCondition.status = 'PUBLISHED';
    const blog = await Blog.findOne(findCondition);
    if (!blog) {
        return res.json({ success: false, message: "Blog not found" });
    }
    res.json({ success: true, data: blog });
};

const changeBlogStatus = async (req, res) => {
    try {
        const { id, newStatus } = req.body;
        const blog = await Blog.findById(id);
        if (!blog) {
            return res.json({ success: false, message: "Blog not found" });
        }
        blog.status = newStatus;
        await blog.save();

        if (newStatus !== "PUBLISHED") {
            return res.json({success: true,message: "Blog status updated successfully"})
        }
        if (blog.isMailSent) {
            return res.json({success: true,message: "Blog published (emails not sent again)"});
        }

        // Respond immediately — do NOT wait for email process
        res.json({success: true,message: "Blog published. Emails are being sent in background...",});

        // ------------- BACKGROUND EMAIL PROCESS (Non-blocking) -------------
        process.nextTick(async () => {
            try {
                const subscribers = await Subscription.find({ status: "SUBSCRIBE" });
                if (!subscribers.length) return;
                await Promise.all(
                    subscribers.map(async (sub) => {
                        await EmailTracking.create({
                            subscriberId: sub._id,
                            contentType: "BLOG",
                            contentId: blog._id,
                            contentTitle: blog.title
                        });

                        await sendSubscribeMail(sub.email, blog);
                    })
                );
                blog.isMailSent = true;
                await blog.save();
            } catch (err) {
                console.log("Email error:", err);
            }
        });

    } catch (error) {
        console.error(error);
        return res.json({ success: false, message: "Something went wrong" });
    }
};

// Like and unlike blog for platform users
// POST /api/blog/like-toggle/:id
const likeBlogToggle = async (req, res) => {
    try {
        const { id } = req.params;
        const mongoose = require('mongoose');
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'Invalid blog ID' });
        }
        const userId = req.user._id.toString();
        const blog = await Blog.findOne({ _id: id, status: 'PUBLISHED' });
        if (!blog) return res.json({ success: false, message: "Blog not found" });
        let liked = false;
        if (blog.likedBy.some((likedUserId) => likedUserId.toString() === userId)) {
            blog.likes -= 1;
            blog.likedBy = blog.likedBy.filter(id => id.toString() !== userId);
            liked = false;
        } else {
            blog.likes += 1;
            blog.likedBy.push(userId);
            liked = true;
        }
        await blog.save();
        res.json({ success: true, likes: blog.likes, liked });
    } catch (err) {
        console.log(err);
        res.json({ success: false, message: "Something went wrong when toggling like" });
    }
};


module.exports = { creteAdminBlog, displayBlog, displayPublishedBlogs, showSlugWiseBlog, changeBlogStatus, likeBlogToggle };
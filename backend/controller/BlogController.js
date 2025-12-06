const {Blog} = require("../model/blog.js");


// Create Blog for admin side
const creteAdminBlog =  async (req, res) => {
   try {
    const {title,slug,thumbnail,content,category,tags,metaTitle,metaDescription,status} = req.body;
    if (!title || !slug || !content || !category || !metaTitle || !metaDescription || !status || !thumbnail || !tags) {
        return res.json({success:false, message: "All fields are required" });
    }
    const blog = await Blog.create({title,slug,thumbnail,contentHTML: content,category,tags,metaTitle,metaDescription,status});
    res.json({success: true, message: "Blog Created Successfully!" });
   } catch (error) {
        console.log(error);
        return res.json({success: false,message: "Something went wrong"});
   }
};
/* For display all blog in admin side */
/* router.post("/admin/blogs", displayBlog); */
const displayBlog = async (req, res) => {
   try {
        const blogs = await Blog.find().select('title slug category thumbnail tags status createdAt').sort({ createdAt: -1 });  
        res.json({success: true, data: blogs });
    } catch (error) {
        console.log(error);
        return res.json({success: false,message: "Something went wrong"});
    }
};

//  Get Single Blog via Slug
//router.get("/blogs/:slug", displayBlog);
const showSlugWiseBlog =  async (req,res)=>{
    const blog = await Blog.findOne({slug:req.params.slug});
    if(!blog){
        return res.json({success:false,message:"Blog not found"});
    }
    res.json({success:true,data:blog});
};

module.exports = {creteAdminBlog,displayBlog,showSlugWiseBlog};
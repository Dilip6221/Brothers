const { AboutTimeLine } = require("../model/AboutTimeLine");
const cloudinary = require("../config/cloudinary");

const uploadToCloudinary = (file) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: "AboutTimeLine" },
            (error, result) => {
                if (result) resolve(result);
                else reject(error);
            }
        );
        stream.end(file.buffer);
    });
};
const createTimeline = async (req, res) => {
    try {
        const { year, title, description, order } = req.body;
        if (!year || !title || !description) {
            return res.json({ success: false, message: "All fields are required" });
        }
        let images = [];
        if (req.files && req.files.length > 0) {
            for (let file of req.files) {
                const uploaded = await uploadToCloudinary(file);
                images.push({
                    url: uploaded.secure_url,
                    public_id: uploaded.public_id
                });
            }
        }
        const timeline = await AboutTimeLine.create({
            year,
            title,
            description,
            order,
            images
        });
        return res.json({success: true,message: "Timeline created successfully",data: timeline});
    } catch (error) {
        console.error(error);
        return res.json({ success: false, message: "Something went wrong" });
    }
};

const updateTimeline = async (req, res) => {
    try {
        const { id, year, title, description, order } = req.body;
        const timeline = await AboutTimeLine.findById(id);
        if (!timeline) {
            return res.json({ success: false, message: "Not found" });
        }
        timeline.year = year || timeline.year;
        timeline.title = title || timeline.title;
        timeline.description = description || timeline.description;
        timeline.order = order ?? timeline.order;

        // ADD NEW IMAGES ONLY
        if (req.files && req.files.length > 0) {
            let newImages = [];
            for (let file of req.files) {
                const uploaded = await uploadToCloudinary(file);
                newImages.push({
                    url: uploaded.secure_url,
                    public_id: uploaded.public_id
                });
            }
            timeline.images = [...timeline.images, ...newImages];
        }
        await timeline.save();
        return res.json({success: true,message: "Updated successfully",data: timeline
        });
    } catch (err) {
        console.error(err);
        return res.json({ success: false, message: "Update failed" });
    }
};
const deleteTimelineImage = async (req, res) => {
    try {
        const { timelineId, public_id } = req.body;
        const timeline = await AboutTimeLine.findById(timelineId);
        if (!timeline) {
            return res.json({ success: false, message: "Not found" });
        }
        await cloudinary.uploader.destroy(public_id);
        timeline.images = timeline.images.filter(
            img => img.public_id !== public_id
        );
        await timeline.save();
        return res.json({success: true,message: "Image deleted"});
    } catch (err) {
        console.error(err);
        return res.json({ success: false, message: "Delete failed" });
    }
};
const deleteTimeline = async (req, res) => {
    try {
        const { id } = req.params;
        const timeline = await AboutTimeLine.findById(id);
        if (!timeline) {
            return res.json({ success: false, message: "Timeline not found" });
        }
        for (let img of timeline.images) {
            if (img.public_id) {
                await cloudinary.uploader.destroy(img.public_id);
            }
        }
        await AboutTimeLine.findByIdAndDelete(id);
        return res.json({success: true,message: "Timeline deleted successfully"});
    } catch (error) {
        console.error(error);
        return res.json({ success: false, message: "Delete failed" });
    }
};
const getTimeline = async (req, res) => {
    try {
        const timeline = await AboutTimeLine.find({ status: "ACTIVE" })
            .sort({ order: 1, createdAt: 1 });
        return res.json({
            success: true,
            data: timeline
        });
    } catch (error) {
        console.error(error);
        return res.json({ success: false, message: "Failed to fetch timeline" });
    }
};
const getSingleTimeline = async (req, res) => {
    try {
        const { id } = req.params;
        const timeline = await AboutTimeLine.findById(id);
        return res.json({success: true,data: timeline});
    } catch (error) {
        console.error(error);
        return res.json({ success: false, message: "Failed" });
    }
};


module.exports = {createTimeline,getTimeline,updateTimeline,deleteTimeline,getSingleTimeline,deleteTimelineImage};
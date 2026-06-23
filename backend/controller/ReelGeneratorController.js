const { ServiceJobs } = require("../model/ServiceJobs");
const { JobServices } = require("../model/JobServices");
const { JobMedia } = require("../model/JobMedia");
const { UserCars } = require("../model/UserCars");
const { generateReelCaption } = require("../utils/reelCaptionGenerator");
const { buildReelSequence } = require("../utils/reelMediaSelector");
const { createReelFromJobMedia } = require("../utils/createReelFromJobMedia");
const cloudinary = require("../config/cloudinary");

const generateJobReel = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { template = "CINEMATIC" } = req.body;
    const job = await ServiceJobs.findById(jobId).populate("userId", "name phone email");
    if (!job) {
      return res.json({ success: false, message: "Job not found" });
    }
    const car = await UserCars.findById(job.carId);
    const services = await JobServices.find({ jobId });
    const media = await JobMedia.find({
      jobId,
      isActive: true,
    }).sort({ createdAt: 1 });

    if (!media.length) {
      return res.json({ success: false, message: "No media found for reel generation" });
    }
    const reelSequence = buildReelSequence(media);

    if (reelSequence.length < 3) {
      return res.json({
        success: false,
        message: "Minimum 3 media required to generate reel",
      });
    }
    const caption = generateReelCaption({
      job,
      car,
      services,
    });

    job.reel.status = "PROCESSING";
    job.reel.template = template;
    job.reel.caption = caption;
    job.reel.mediaCount = media.length;
    job.reel.errorMessage = "";
    await job.save();

    const reelResult = await createReelFromJobMedia({
      job,
      car,
      services,
      media: reelSequence,
      template,
    });


    if (!reelResult.success) {
      job.reel.status = "FAILED";
      job.reel.errorMessage = reelResult.message || "Reel generation failed";
      await job.save();

      return res.json({
        success: false,
        message: "Reel generation failed",
      });
    }

    const uploadResult = await cloudinary.uploader.upload(reelResult.reelPath, {
      folder: `job-reels/${job._id}`,
      resource_type: "video",
    });

    job.reel.status = "READY";
    job.reel.video.url = uploadResult.secure_url;
    job.reel.video.publicId = uploadResult.public_id;
    job.reel.duration = reelResult.duration;
    job.reel.generatedAt = new Date();
    job.reel.errorMessage = "";

    await job.save();

    console.log("Reel Result:", reelResult);
    return res.json({
      success: true,
      message: "Reel generation started",
      data: {
        status: job.reel.status,
        template,
        caption,
        mediaCount: media.length,
        reelMediaCount: reelSequence.length,

        reel: {
          status: job.reel.status,
          url: job.reel.video.url,
          publicId: job.reel.video.publicId,
          duration: job.reel.duration,
          generatedAt: job.reel.generatedAt,
        },

        reelSequence: reelSequence.map((m) => ({
          id: m._id,
          type: m.mediaType,
          stage: m.stage,
          url: m.url,
        })),
      },
    });
  } catch (error) {
    console.error("generateJobReel error:", error);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  generateJobReel,
};
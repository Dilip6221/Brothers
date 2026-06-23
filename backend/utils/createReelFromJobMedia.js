const path = require("path");
const fs = require("fs-extra");
const axios = require("axios");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");
const { createOutroClip } = require("./createOutroClip");
const { createIntroClip } = require("./createIntroClip");
const sharp = require("sharp");

ffmpeg.setFfmpegPath(ffmpegPath);

const TEMP_DIR = path.join(__dirname, "../temp/reels");

const downloadFile = async (url, outputPath) => {
    const response = await axios({
        method: "GET",
        url,
        responseType: "stream",
    });

    await fs.ensureDir(path.dirname(outputPath));

    const writer = fs.createWriteStream(outputPath);

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
    });
};

const runFfmpeg = (command) => {
    return new Promise((resolve, reject) => {
        command
            .on("end", resolve)
            .on("error", reject)
            .run();
    });
};

const convertImageToJpg = async (inputPath) => {
    const jpgPath = inputPath.replace(
        /\.[^/.]+$/,
        "-converted.jpg"
    );

    await sharp(inputPath)
        .jpeg({ quality: 90 })
        .toFile(jpgPath);

    return jpgPath;
};
const createVideoClip = async (
    videoPath,
    outputPath,
    duration = 5
) => {
    const command = ffmpeg(videoPath)
        .outputOptions([
            "-t 5",
            "-vf", "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,eq=contrast=1.1:saturation=1.15",
            "-r 30",
            "-an",
            "-pix_fmt yuv420p",
            "-c:v libx264",
        ])
        .output(outputPath);

    await runFfmpeg(command);
};
const createImageClip = async (
    imagePath,
    outputPath,
    duration = 3
) => {
    const command = ffmpeg()
        .input(imagePath)
        .inputOptions(["-loop 1"])
        .outputOptions([
            "-t 3",
            "-vf", "scale=1400:-1,zoompan=z='min(zoom+0.0015,1.4)':d=90:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1080x1920",
            "-r 30",
            "-pix_fmt yuv420p",
            "-c:v libx264",
        ])
        .output(outputPath);

    await runFfmpeg(command);
};
const concatClips = async (clips, outputPath, workDir) => {
    const listPath = path.join(workDir, "clips.txt");

    const fileContent = clips
        .map((clip) => `file '${clip.replace(/\\/g, "/")}'`)
        .join("\n");
    console.log("Merging clips...");

    await fs.writeFile(listPath, fileContent);

    const command = ffmpeg()
        .input(listPath)
        .inputOptions(["-f concat", "-safe 0"])
        .outputOptions(["-c copy"])
        .output(outputPath)
        .on("start", cmd => {
            console.log("FFMPEG MERGE:", cmd);
        })
        .on("progress", progress => {
            console.log("MERGING:", progress.percent);
        });

    await runFfmpeg(command);
};

const createReelFromJobMedia = async ({
    job,
    media,
    template = "CINEMATIC",
}) => {
    const workDir = path.join(TEMP_DIR, String(job._id));

    await fs.remove(workDir);
    await fs.ensureDir(workDir);

    console.log("Generating Reel...");
    console.log("Job:", job.jobCode);
    console.log("Media Count:", media.length);

    const clips = [];

    const introPath = path.join(workDir, "intro.mp4");

    await createIntroClip(introPath);

    clips.push(introPath);
    for (let i = 0; i < media.length; i++) {
        const item = media[i];
        console.log("Downloading:", item.url);

        const ext = item.url.split(".").pop().split("?")[0];
        const inputPath = path.join(workDir, `input-${i}.${ext}`);
        const clipPath = path.join(workDir, `clip-${i}.mp4`);

        await downloadFile(item.url, inputPath);
        let mediaInputPath = inputPath;


        if (item.mediaType !== "video") {
            mediaInputPath = await convertImageToJpg(inputPath);
            await createImageClip(
                mediaInputPath,
                clipPath,
                3,
            );
        } else {

            console.log("Creating video clip:", clipPath);

            await createVideoClip(
                inputPath,
                clipPath,
                5,
            );
        }
        console.log("Clip created:", clipPath);

        clips.push(clipPath);
    }
    const outroPath = path.join(workDir, "outro.mp4");
    await createOutroClip(outroPath);
    clips.push(outroPath);

    const finalPath = path.join(workDir, `reel-${job.jobCode}.mp4`);

    await concatClips(clips, finalPath, workDir);

    return {
        success: true,
        reelPath: finalPath,
        duration: clips.length * 3,
    };
};

module.exports = {
    createReelFromJobMedia,
};
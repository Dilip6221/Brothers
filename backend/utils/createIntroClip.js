const ffmpeg = require("fluent-ffmpeg");
const path = require("path");

const createIntroClip = (outputPath) => {
  return new Promise((resolve, reject) => {

    const logoPath = path.join(
      process.cwd(),
      "assets",
      "reel",
      "logo.png"
    );

    ffmpeg()
      .input("color=c=black:s=1080x1920:d=3")
      .inputFormat("lavfi")
      .input(logoPath)
      .complexFilter([
        "[1:v]scale=500:-1[logo]",
        "[logo]fade=t=in:st=0:d=0.8[logo_fade]",
        "[0:v][logo_fade]overlay=(W-w)/2:650"
      ])
      .outputOptions([
        "-t 3",
        "-pix_fmt yuv420p",
        "-c:v libx264"
      ])
      .save(outputPath)
      .on("end", () => {
        console.log("Intro Created");
        resolve(outputPath);
      })
      .on("error", reject);

  });
};

module.exports = {
  createIntroClip,
};
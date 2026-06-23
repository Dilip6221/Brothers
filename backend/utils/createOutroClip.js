const ffmpeg = require("fluent-ffmpeg");
const path = require("path");

const createOutroClip = (outputPath) => {
  return new Promise((resolve, reject) => {
    const logoPath = path.join(
      process.cwd(),
      "assets",
      "reel",
      "logo.png"
    );

    ffmpeg()
      .input("color=c=black:s=1080x1920:d=2")
      .inputFormat("lavfi")
      .input(logoPath)
      .complexFilter([
        "[1:v]scale=500:-1[logo]",
        "[0:v][logo]overlay=(W-w)/2:(H-h)/2"
      ])
      .outputOptions([
        "-t 2",
        "-pix_fmt yuv420p"
      ])
      .save(outputPath)
      .on("end", () => {
        console.log("Outro Created");
        resolve(outputPath);
      })
      .on("error", reject);
  });
};

module.exports = {
  createOutroClip,
};
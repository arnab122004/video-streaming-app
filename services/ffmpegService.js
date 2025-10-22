import ffmpeg from "fluent-ffmpeg";
import path from "path";
import ffmpegPath from "@ffmpeg-installer/ffmpeg";
import ffprobePath from "@ffprobe-installer/ffprobe";

// Set paths
ffmpeg.setFfmpegPath(ffmpegPath.path);
ffmpeg.setFfprobePath(ffprobePath.path);

export function transcodeToHLS(inputPath, outputDir, baseName) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .outputOptions([
        "-profile:v baseline",
        "-level 3.0",
        "-start_number 0",
        "-hls_time 10",
        "-hls_list_size 0",
        "-f hls"
      ])
      .output(path.join(outputDir, `${baseName}.m3u8`))
      .on("end", resolve)
      .on("error", reject)
      .run();
  });
}

export function generateThumbnail(inputPath, outputDir, baseName) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .screenshots({
        timestamps: ["50%"],
        filename: `${baseName}.png`,
        folder: outputDir,
        size: "320x240"
      })
      .on("end", () => resolve(`${baseName}.png`))
      .on("error", reject);
  });
}


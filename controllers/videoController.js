import path from "path";
import fs from "fs";
import Video from "../models/video.js";
import Like from "../models/like.js";
import Comment from "../models/comment.js";
import { transcodeToHLS, generateThumbnail } from "../services/ffmpegService.js";

// Upload video
export const uploadVideo = async (req, res) => {
  try {
    const { title, description, tags, category } = req.body;
    const filePath = req.file.path;
    const baseName = path.parse(req.file.filename).name;

    const outputDir = "public/videos";
    const thumbDir = "public/thumbnails";

    await transcodeToHLS(filePath, outputDir, baseName);
    const thumbName = await generateThumbnail(filePath, thumbDir, baseName);

    const video = new Video({
      title,
      description,
      tags: tags.split(","),
      category,
      fileUrl: `/videos/${baseName}.m3u8`,
      thumbnailUrl: `/thumbnails/${thumbName}`,
      uploader: req.session.user._id, // link video to logged-in user
      likeCount: 0,       // optional, schema default is 0
      dislikeCount: 0,    // optional, schema default is 0
    });

    await video.save();
    fs.unlinkSync(filePath); // delete original upload
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.render("error", { message: "Upload failed" });
  }
};

// List videos
export const listVideos = async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.render("home", { videos });
  } catch (err) {
    console.error(err);
    res.render("error", { message: "Failed to load videos" });
  }
};

// Watch single video (with likes, dislikes, comments)
export const watchVideo = async (req, res) => {
  try {
    const videoId = req.params.id;
    const userId = req.session?.user?._id; // logged-in user

    const video = await Video.findById(videoId);
    if (!video) return res.status(404).send("Video not found");

    // Increment view count
    video.views += 1;
    await video.save();

    // Check user’s previous reaction (if using Like collection)
    let userLiked = false;
    let userDisliked = false;
    if (userId) {
      const userReaction = await Like.findOne({ video: videoId, user: userId });
      if (userReaction) {
        userLiked = userReaction.isLike === true;
        userDisliked = userReaction.isLike === false;
      }
    }

    // Fetch comments
    const comments = await Comment.find({ video: videoId })
      .populate("user", "username")
      .sort({ createdAt: -1 });

    // Render with all data

    // console.log({ userLiked, userDisliked });
    // console.log("Session user:", req.session.user);
    // console.log(req.session.user.id)
    // console.log(req.session.user._id)

    res.render("watch", {
      video,
      comments,
      likesCount: video.likeCount,
      dislikesCount: video.dislikeCount,
      userLiked,
      userDisliked,
      isLoggedIn: !!req.session.user,
    });
  } catch (err) {
    console.error("Error loading video:", err);
    res.status(500).send("Server error");
  }
};
import User from "../models/user.js";
import Video from "../models/video.js";

// GET /user/profile
export const getProfilePage = async (req, res) => {
  try {
    // Fetch current user from session
    const user = await User.findById(req.session.user._id); 
    res.render("profile", { user});
    } catch (err) {
    console.error(err);
    res.redirect("/"); // fallback
  }
};

//GET /user/uploaded-videos new page show uploaded video by user
export const uploadedVideos= async (req, res) => {
  try {
    // Fetch current user from session
    const user = await User.findById(req.session.user._id);

    // Fetch videos uploaded by this user
    const videos = await Video.find({ uploader: user._id }).sort({ createdAt: -1 });

    res.render("uploadedVideos", { user, videos });
  } catch (err) {
    console.error(err);
    res.redirect("/"); // fallback
  }
};

// POST /user/delete-video/:id
export const deleteUploadedVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    // Only allow the uploader to delete
    if (!video || video.uploader.toString() !== req.session.user._id) {
      return res.status(403).send("Unauthorized");
    }

    await Video.findByIdAndDelete(req.params.id);
    res.redirect("/user/uploaded-videos");
  } catch (err) {
    console.error(err);
    res.redirect("/user/uploaded-videos");
  }
};
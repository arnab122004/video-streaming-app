import User from "../models/user.js";

export const showLikedVideos = async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id).populate("likedVideos");

    res.render("userLikedVideos", {
      user,
      likedVideos: user.likedVideos || [],
    });
  } catch (error) {
    console.error("Error fetching liked videos:", error);
    res.status(500).send("Server error");
  }
};
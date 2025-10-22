import Video from "../models/video.js";
import Like from "../models/like.js";
import User from "../models/user.js";

//  Toggle Like
export const toggleLike = async (req, res) => {
  const { videoId } = req.params;
  const userId = req.session.user?._id || req.session.user?.id;

  try {
    const video = await Video.findById(videoId);
    const user = await User.findById(userId);
    if (!video || !user) return res.status(404).json({ message: "Not found" });

    const existingReaction = await Like.findOne({ video: videoId, user: userId });

    if (existingReaction && existingReaction.isLike) {
      //  Remove like
      video.likeCount = Math.max(0, video.likeCount - 1);
      await existingReaction.deleteOne();
      // Remove from user's liked videos
      user.likedVideos = user.likedVideos.filter(
        (id) => id.toString() !== videoId.toString()
      );
    } else if (existingReaction && existingReaction.isLike === false) {
      //  Switch from dislike to like
      video.likeCount += 1;
      video.dislikeCount = Math.max(0, video.dislikeCount - 1);
      existingReaction.isLike = true;
      await existingReaction.save();
      // Add to user's liked videos
      if (!user.likedVideos.includes(videoId)) user.likedVideos.push(videoId);
    } else {
      //  New like
      video.likeCount += 1;
      await Like.create({ video: videoId, user: userId, isLike: true });
      // Add to user's liked videos
      if (!user.likedVideos.includes(videoId)) user.likedVideos.push(videoId);
    }

    await video.save();
    await user.save();

    res.json({
      success: true,
      likeCount: video.likeCount,
      dislikeCount: video.dislikeCount,
    });
  } catch (err) {
    console.error("Error toggling like:", err);
    res.status(500).json({ message: "Server error" });
  }
};

//  Toggle Dislike
export const toggleDislike = async (req, res) => {
  const { videoId } = req.params;
  const userId = req.session.user?._id || req.session.user?.id;

  try {
    const video = await Video.findById(videoId);
    const user = await User.findById(userId);
    if (!video || !user) return res.status(404).json({ message: "Not found" });

    const existingReaction = await Like.findOne({ video: videoId, user: userId });

    if (existingReaction && existingReaction.isLike === false) {
      //  Remove dislike
      video.dislikeCount = Math.max(0, video.dislikeCount - 1);
      await existingReaction.deleteOne();
    } else if (existingReaction && existingReaction.isLike) {
      //  Switch from like to dislike
      video.dislikeCount += 1;
      video.likeCount = Math.max(0, video.likeCount - 1);
      existingReaction.isLike = false;
      await existingReaction.save();
      // Remove from user's liked videos
      user.likedVideos = user.likedVideos.filter(
        (id) => id.toString() !== videoId.toString()
      );
    } else {
      //  New dislike
      video.dislikeCount += 1;
      await Like.create({ video: videoId, user: userId, isLike: false });
    }

    await video.save();
    await user.save();

    res.json({
      success: true,
      likeCount: video.likeCount,
      dislikeCount: video.dislikeCount,
    });
  } catch (err) {
    console.error("Error toggling dislike:", err);
    res.status(500).json({ message: "Server error" });
  }
};

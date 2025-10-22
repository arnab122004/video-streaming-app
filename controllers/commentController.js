import Comment from "../models/comment.js";

/**
 * Add a comment dynamically
 */
export const addComment = async (req, res) => {
  try {
    const { videoId } = req.params;
    const userId = req.session.user?._id || req.session.user?.id;

    if (!userId) return res.status(401).json({ success: false, message: "Not logged in" });

    const { text } = req.body;
    if (!text || text.trim() === "") {
      return res.status(400).json({ success: false, message: "Comment cannot be empty" });
    }

    const comment = new Comment({ video: videoId, user: userId, text: text.trim() });
    await comment.save();

    // Populate username for frontend
    await comment.populate("user", "username");

    res.json({ success: true, comment });
  } catch (err) {
    console.error("Add Comment Error:", err);
    res.status(500).json({ success: false, message: "Server error while adding comment" });
  }
};

/**
 * Get all comments for a video
 */
export const getComments = async (req, res) => {
  try {
    const { videoId } = req.params;

    const comments = await Comment.find({ video: videoId })
      .populate("user", "username email")
      .sort({ createdAt: -1 });

    res.json({ success: true, count: comments.length, comments });
  } catch (err) {
    console.error("Get Comments Error:", err);
    res.status(500).json({ success: false, message: "Error fetching comments" });
  }
};

/**
 * Delete a comment dynamically
 */
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.session.user?.id || req.session.user?._id;

    if (!userId) return res.status(401).json({ success: false, message: "Not logged in" });

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ success: false, message: "Comment not found" });

    if (comment.user.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    await Comment.findByIdAndDelete(commentId);

    res.json({ success: true, message: "Comment deleted" });
  } catch (err) {
    console.error("Delete Comment Error:", err);
    res.status(500).json({ success: false, message: "Server error while deleting comment" });
  }
};
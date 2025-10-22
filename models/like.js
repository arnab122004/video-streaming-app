import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
  video: { type: mongoose.Schema.Types.ObjectId, ref: "Video", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  isLike: { type: Boolean, required: true }, // true = like, false = dislike
  createdAt: { type: Date, default: Date.now }
});

// Prevent a user from liking/disliking the same video twice
likeSchema.index({ video: 1, user: 1 }, { unique: true });

export default mongoose.model("Like", likeSchema);

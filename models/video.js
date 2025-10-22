import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: String,
  description: String,
  tags: [String],
  category: String,
  fileUrl: String,
  thumbnailUrl: String,
  views: { type: Number, default: 0 },

  likeCount: { type: Number, default: 0 },      // add this for count like
  dislikeCount: { type: Number, default: 0 },   // add this for count dislike

  // Reference to the user who uploaded the video
  uploader: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Video", videoSchema);


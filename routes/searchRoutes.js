import express from "express";
import Video from "../models/video.js";

const router = express.Router();

// Handle search queries
router.get("/", async (req, res) => {
  try {
    const query = req.query.q || "";
    const videos = await Video.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { tags: { $regex: query, $options: "i" } }
      ]
    }).sort({ createdAt: -1 });

    // Render the search results page
    res.render("search", { videos, query });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

export default router;

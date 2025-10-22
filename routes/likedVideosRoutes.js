import express from "express";
import { ensureAuth } from "../middleware/authMiddleware.js";
import { showLikedVideos } from "../controllers/likedVideosController.js";

const router = express.Router();

// Show all liked videos for the logged-in user
router.get("/liked-videos", ensureAuth, showLikedVideos);

export default router;
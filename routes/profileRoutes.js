import express from "express";
import { ensureAuth } from "../middleware/authMiddleware.js";
import { getProfilePage,uploadedVideos, deleteUploadedVideo } from "../controllers/profileController.js";

const router = express.Router();

// Profile page
router.get("/profile", ensureAuth, getProfilePage);

//profile page to authenticate user uploaded-videos page
router.get("/uploaded-videos",ensureAuth,uploadedVideos)

// Delete a video
router.post("/delete-video/:id", ensureAuth, deleteUploadedVideo);

export default router;

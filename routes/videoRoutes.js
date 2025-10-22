import express from "express";
import { upload } from "../config/multer.js";
import { uploadVideo, watchVideo } from "../controllers/videoController.js";
import { ensureAuth } from "../middleware/authMiddleware.js"; // ✅ Move import to top

const router = express.Router();

// GET route to render upload page
router.get("/upload", (req, res) => {
  res.render("upload"); // render upload.ejs
});

// POST route to handle video upload (only for authenticated users)
router.post("/upload", ensureAuth, upload.single("video"), uploadVideo);

// GET route to watch a video
router.get("/watch/:id", watchVideo);

export default router;

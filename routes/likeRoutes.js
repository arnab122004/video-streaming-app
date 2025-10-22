import express from "express";
import { ensureAuth } from "../middleware/authMiddleware.js";
import { toggleLike, toggleDislike } from "../controllers/likeController.js";


const router = express.Router();

router.post("/like/:videoId", ensureAuth, toggleLike);
router.post("/dislike/:videoId", ensureAuth, toggleDislike);

export default router;
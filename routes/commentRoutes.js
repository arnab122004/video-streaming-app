import express from "express";
import { addComment, deleteComment } from "../controllers/commentController.js";
import { ensureAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/:videoId", ensureAuth, addComment);
router.delete("/delete/:commentId", ensureAuth, deleteComment);

export default router;

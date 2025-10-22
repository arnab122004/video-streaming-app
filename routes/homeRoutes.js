import express from "express";
import { listVideos } from "../controllers/videoController.js";

const router = express.Router();
router.get("/", listVideos);

export default router;

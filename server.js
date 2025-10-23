import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from "./config/db.js";
import { createSessionMiddleware, userMiddleware } from "./config/sessionConfig.js";
import homeRoutes from "./routes/homeRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import userRouter from "./routes/userRoutes.js"; // adjust path if needed
import profileRouter from "./routes/profileRoutes.js";
import likeRouter from "./routes/likeRoutes.js";
import commentRouter from "./routes/commentRoutes.js";
import showLikedVideosRouter from "./routes/likedVideosRoutes.js";

dotenv.config();
const app = express();


// Fix __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//  Connect to MongoDB first
await connectDB();

//  Now create session middleware after DB is connected
app.use(createSessionMiddleware());
app.use(userMiddleware);

// Other middleware
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", homeRoutes);
app.use("/videos", videoRoutes);//included upload function
app.use("/search", searchRoutes);
app.use("/auth", userRouter);
app.use("/user",profileRouter);
app.use("/decideLikeDislike", likeRouter);
app.use("/comments", commentRouter);
app.use("/user",showLikedVideosRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

import express from "express";
import { requestOTP, verifyOTP, loginUser, logoutUser } from "../controllers/authController.js";

const router = express.Router();

//  Registration with OTP
router.get("/register", (req, res) => res.render("register", { error: null }));
router.post("/register", requestOTP);
router.post("/verify-otp", verifyOTP);

//  Login / Logout
router.get("/login", (req, res) => res.render("login", { error: null }));
router.post("/login", loginUser);
router.get("/logout", logoutUser);

export default router;
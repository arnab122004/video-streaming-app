import User from "../models/user.js";
import { sendOTPEmail } from "../services/emailService.js";

/**
 * STEP 1: Send OTP for registration
 */
export const requestOTP = async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    if (!username || !email || !password || !confirmPassword)
      return res.render("register", { error: "All fields are required" });

    if (password !== confirmPassword)
      return res.render("register", { error: "Passwords do not match" });

    const existing = await User.findOne({ email });
    if (existing)
      return res.render("register", { error: "User already exists with this email" });
    

    //  Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    //  Save in session (temporary memory)
    req.session.otpData = {
      otp,
      email,
      username,
      password,
      expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes
    };

    //  Send email
    await sendOTPEmail(email, otp);

    // Ask user to verify
    res.render("verifyOtp", { email, error: null });
  } catch (err) {
    console.error(err);
    res.render("register", { error: "Failed to send OTP. Try again." });
  }
};

/**
 * STEP 2: Verify OTP and create user
 */
export const verifyOTP = async (req, res) => {
  try {
    const { otp } = req.body;
    const data = req.session.otpData;

    if (!data)
      return res.render("register", { error: "Session expired. Please register again." });

    if (Date.now() > data.expiresAt)
      return res.render("verifyOtp", { email: data.email, error: "OTP expired. Try again." });

    if (otp !== data.otp)
      return res.render("verifyOtp", { email: data.email, error: "Invalid OTP. Try again." });

    //  OTP correct → create user
    const user = await User.create({
      username: data.username,
      email: data.email,
      password: data.password // Auto-hashed by model
    });

    //  Clear OTP session
    delete req.session.otpData;

    //  Log in immediately
    req.session.user = { _id: user._id, username: user.username, email: user.email };

    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.render("verifyOtp", { email: req.session.otpData?.email, error: "Something went wrong." });
  }
};



export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    return res.render("login", { error: "Invalid credentials" });
  }
  req.session.user = { _id: user._id, username: user.username };
  res.redirect("/");
};

export const logoutUser = (req, res) => {
  req.session.destroy(() => res.redirect("/"));
};

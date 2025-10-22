import nodemailer from "nodemailer";

let transporter;

/**
 * Initialize NodeMailer
 */
export const initEmailService = () => {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

/**
 * Send OTP email
 */
export const sendOTPEmail = async (to, otp) => {
  if (!transporter) throw new Error("Email service not initialized");

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: "Your OTP Code",
    text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
  });
};

// emailService.js
import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Send OTP email
 */
export const sendOTPEmail = async (to, otp) => {
  const msg = {
    to,
    from: process.env.EMAIL_FROM,  // Verified sender in SendGrid
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}`,
    html: `<p>Your OTP code is <b>${otp}</b></p>`,
  };

  try {
    await sgMail.send(msg);
    console.log("OTP email sent to", to);
  } catch (error) {
    console.error("Error sending OTP email:", error.response?.body || error);
  }
};

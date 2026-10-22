import User from "../model/userModel.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { genToken, genToken1 } from "../config/token.js";
import { cookieOptions, clearCookieOptions } from "../config/cookie.js";

   const sendOtpEmail = async (email, otp) => {
    
     const res = await fetch("https://api.brevo.com/v3/smtp/email", {
       method: "POST",
       headers: {
         "api-key": process.env.BREVO_API_KEY,
         "Content-Type": "application/json",
       },
       body: JSON.stringify({
         sender: { name: "DukaanX", email: process.env.EMAIL },
         to: [{ email }],
         subject: "DukaanX Password Reset OTP",
         textContent: `Your OTP for password reset is ${otp}. It is valid for 5 minutes.`,
       }),
     });

     if (!res.ok) throw new Error(`Email failed: ${await res.text()}`);
   };


const isStr = (v) => typeof v === "string";
const cleanEmail = (e) => (isStr(e) ? e.trim().toLowerCase() : null);

const safeEqual = (a, b) => {
  const ha = crypto.createHash("sha256").update(String(a)).digest();
  const hb = crypto.createHash("sha256").update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb);
};

const MAX_OTP_ATTEMPTS = 5;

export const register = async (req, res) => {
  try {
    const name = isStr(req.body.name) ? req.body.name.trim() : "";
    const email = cleanEmail(req.body.email);
    const { password } = req.body;

    if (!name || !email || !isStr(password)) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const exists = await User.findOne({ email });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashedPassword });

    const token = genToken(user._id);

    res.cookie("userToken", token, cookieOptions);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const email = cleanEmail(req.body.email);
    const { password } = req.body;

    if (!email || !isStr(password)) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    const token = genToken(user._id);

    res.cookie("userToken", token, cookieOptions);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const email = cleanEmail(req.body.email);

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    if (user) {
      const otp = String(crypto.randomInt(100000, 1000000));

      user.resetOtp = otp;
      user.otpExpire = Date.now() + 5 * 60 * 1000;
      user.otpAttempts = 0;
      user.isOtpVerified = false;

      await user.save();
      await sendOtpEmail(email, otp);
    }

    // same response chahe user ho ya na ho (user enumeration se bachne ke liye)
    return res.status(200).json({
      success: true,
      message: "If this email is registered, an OTP has been sent",
    });
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const email = cleanEmail(req.body.email);
    const otp = req.body.otp;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP required",
      });
    }

    const user = await User.findOne({ email });

    if (!user || !user.resetOtp) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    if (!user.otpExpire || user.otpExpire < Date.now()) {
      user.resetOtp = "";
      await user.save();
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    if (user.otpAttempts >= MAX_OTP_ATTEMPTS) {
      user.resetOtp = "";
      await user.save();
      return res.status(429).json({
        success: false,
        message: "Too many attempts. Request a new OTP",
      });
    }

    if (!safeEqual(String(user.resetOtp).trim(), String(otp).trim())) {
      user.otpAttempts += 1;
      await user.save();
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

   user.isOtpVerified = true;
user.resetOtp = "";
user.otpAttempts = 0;
user.otpExpire = Date.now() + 10 * 60 * 1000; 
await user.save();

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const email = cleanEmail(req.body.email);
    const { password } = req.body;

    if (!email || !isStr(password) || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Valid email and password (min 6 chars) required",
      });
    }

    const user = await User.findOne({ email });

    // OTP verify hua ho aur window abhi khatam na hui ho
    if (
      !user ||
      !user.isOtpVerified ||
      !user.otpExpire ||
      user.otpExpire < Date.now()
    ) {
      return res.status(403).json({
        success: false,
        message: "OTP verification required",
      });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetOtp = "";
    user.otpExpire = null;
    user.otpAttempts = 0;
    user.isOtpVerified = false;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("userToken", clearCookieOptions);
  res.clearCookie("adminToken", clearCookieOptions);

  return res.status(200).json({
    success: true,
    message: "Logout successful",
  });
};

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      !isStr(email) ||
      !isStr(password) ||
      !safeEqual(email, process.env.ADMIN_EMAIL) ||
      !safeEqual(password, process.env.ADMIN_PASSWORD)
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = genToken1(email);

    res.cookie("adminToken", token, cookieOptions);

    return res.status(200).json({
      success: true,
      message: "Admin Login Successful",
    });
  } catch (error) {
    console.error("ADMIN LOGIN ERROR:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
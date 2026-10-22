import express from "express";
import rateLimit from "express-rate-limit";
import {
  register,
  login,
  logout,
  adminLogin,
  forgotPassword,
  verifyOtp,
  resetPassword,
} from "../controller/authController.js";

const authRouter = express.Router();

const limiter = (max) =>
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Too many requests, try later" },
  });

authRouter.post("/register", limiter(20), register);
authRouter.post("/login", limiter(20), login);
authRouter.post("/logout", logout);
authRouter.post("/adminlogin", limiter(10), adminLogin);
authRouter.post("/forgot-password", limiter(5), forgotPassword);
authRouter.post("/verify-otp", limiter(10), verifyOtp);
authRouter.post("/reset-password", limiter(10), resetPassword);

export default authRouter;
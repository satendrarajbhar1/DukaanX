import express from "express";
import { getDashboardData } from "../controller/adminController.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

router.get("/dashboard", adminAuth, getDashboardData);

export default router;

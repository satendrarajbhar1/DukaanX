import express from "express";

import {
  placeOrder,
  placeOrderRazorpay,
  verifyRazorpay,
  userOrders,
  allOrders,
  updateStatus,
} from "../controller/orderController.js";

import isAuth from "../middleware/isAuth.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

router.post("/place", isAuth, placeOrder);

router.post("/razorpay", isAuth, placeOrderRazorpay);

router.post("/verify", isAuth, verifyRazorpay);

router.get("/userorders", isAuth, userOrders);

router.get("/allorders", adminAuth, allOrders);

router.post("/status", adminAuth, updateStatus);

export default router;

import express from "express";
import upload from "../middleware/multer.js";
import {
  addProduct,
  listProduct,
  removeProduct,
  singleProduct,
} from "../controller/productController.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

router.post(
  "/addproduct",
  adminAuth, // pehle auth, phir upload
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  addProduct
);
router.get("/list", listProduct);
router.post("/remove/:id", adminAuth, removeProduct);
router.get("/single/:id", singleProduct);

export default router;
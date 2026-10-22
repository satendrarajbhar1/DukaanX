import fs from "fs";
import mongoose from "mongoose";
import uploadOnCloudinary from "../config/cloudinary.js";
import Product from "../model/productModel.js";

const removeTempFiles = (files) => {
  Object.values(files || {})
    .flat()
    .forEach((f) => {
      try {
        if (fs.existsSync(f.path)) fs.unlinkSync(f.path);
      } catch {}
    });
};

export const addProduct = async (req, res) => {
  try {
    const { name, description, category, subCategory, price, sizes, bestSeller } =
      req.body;

    let parsedSizes = null;
    try {
      parsedSizes = JSON.parse(sizes);
    } catch {}

    const numPrice = Number(price);

    if (
      !name ||
      !description ||
      !category ||
      !subCategory ||
      !Number.isFinite(numPrice) ||
      numPrice <= 0 ||
      !Array.isArray(parsedSizes) ||
      parsedSizes.length === 0 ||
      !req.files?.image1?.[0]
    ) {
      removeTempFiles(req.files);
      return res.status(400).json({
        success: false,
        message: "Name, description, category, price, sizes and image1 are required",
      });
    }

    const keys = ["image1", "image2", "image3", "image4"];

    const [image1, image2, image3, image4] = await Promise.all(
      keys.map((k) =>
        req.files[k]?.[0] ? uploadOnCloudinary(req.files[k][0].path) : ""
      )
    );

    const product = await Product.create({
      name,
      description,
      category,
      subCategory,
      price: numPrice,
      sizes: parsedSizes,
      bestSeller: bestSeller === "true" || bestSeller === true,
      date: Date.now(),
      image1,
      image2,
      image3,
      image4,
    });

    return res.status(201).json({
      success: true,
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    console.error("ADD PRODUCT ERROR:", error);
    removeTempFiles(req.files);
    res.status(500).json({ success: false, message: "Failed to add product" });
  }
};

export const listProduct = async (req, res) => {
  try {
    const products = await Product.find({});
    return res.status(200).json({ success: true, products });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const removeProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid id" });
    }

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product removed successfully",
      product,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const singleProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid id" });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({ success: true, product });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
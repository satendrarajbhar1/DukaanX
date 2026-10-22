import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    image1: {
      type: String,
      required: true,
    },

    image2: {
      type: String,
      default: "",
    },

    image3: {
      type: String,
      default: "",
    },

    image4: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      required: true,
    },

    subCategory: {
      type: String,
      required: true,
    },

    sizes: {
      type: [String],
      required: true,
    },

    bestSeller: {
      type: Boolean,
      default: false,
    },

    date: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Product", productSchema);

import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  items: [
    {
      productId: String,
      name: String,
      image: String,
      price: Number,
      quantity: Number,
      size: String,
    },
  ],

  amount: {
    type: Number,
    required: true,
  },

  address: {
    type: Object,
    required: true,
  },

  status: {
    type: String,
    default: "Order Placed",
  },

  date: {
    type: Date,
    default: Date.now,
  },

  paymentMethod: {
    type: String,
    enum: ["COD", "Razorpay"],
    default: "COD",
  },

  payment: {
    type: Boolean,
    default: false,
  },

  razorpayOrderId: {
    type: String,
    default: "",
  },

  razorpayPaymentId: {
    type: String,
    default: "",
  },
});

export default mongoose.model("Order", orderSchema);

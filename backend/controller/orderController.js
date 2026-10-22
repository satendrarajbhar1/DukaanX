import mongoose from "mongoose";
import Order from "../model/orderModel.js";
import Razorpay from "razorpay";
import crypto from "crypto";
import Product from "../model/productModel.js";

const currency = "INR";
const DELIVERY_FEE = 30;

const ORDER_STATUSES = [
  "Order Placed",
  "Packing",
  "Shipped",
  "Out for delivery",
  "Delivered",
  "Cancelled",
]; // apne admin panel ke status values ke hisaab se adjust karo

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const badRequest = (message) => Object.assign(new Error(message), { status: 400 });

const sendError = (res, error, label) => {
  const rzpMsg = error?.error?.description; // Razorpay ka asli message
  console.error(label, rzpMsg || error);

  const status = error.status || 500;

  res.status(status).json({
    success: false,
    message:
      status === 500
        ? process.env.NODE_ENV === "production"
          ? "Server error"
          : rzpMsg || error.message || "Server error"
        : error.message,
  });
};

// client se sirf productId, quantity, size lete hain; price/name/image DB se
const buildOrderItems = async (items) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw badRequest("Cart is empty");
  }

  if (items.some((i) => !mongoose.isValidObjectId(i?.productId))) {
    throw badRequest("Invalid product");
  }

  const ids = items.map((i) => i.productId);
  const products = await Product.find({ _id: { $in: ids } });
  const productMap = new Map(products.map((p) => [p._id.toString(), p]));

  let subtotal = 0;

  const orderItems = items.map((i) => {
    const product = productMap.get(String(i.productId));

    if (!product) throw badRequest(`Product not found: ${i.productId}`);

    const quantity = Number(i.quantity);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
      throw badRequest("Invalid quantity");
    }

    if (!product.sizes.includes(i.size)) {
      throw badRequest(`Invalid size for ${product.name}`);
    }

    subtotal += product.price * quantity;

    return {
      productId: product._id.toString(),
      name: product.name,
      image: product.image1,
      price: product.price,
      quantity,
      size: i.size,
    };
  });

  return { orderItems, subtotal };
};

const validAddress = (address) =>
  address && typeof address === "object" && !Array.isArray(address);

export const placeOrder = async (req, res) => {
  try {
    const { items, address } = req.body;

    if (!validAddress(address)) throw badRequest("Address is required");

    const { orderItems, subtotal } = await buildOrderItems(items);

    const order = await Order.create({
      userId: req.userId,
      items: orderItems,
      amount: subtotal + DELIVERY_FEE,
      address,
      paymentMethod: "COD",
      payment: false,
      status: "Order Placed",
    });

    res.status(201).json({
      success: true,
      message: "Order Placed Successfully",
      order,
    });
  } catch (error) {
    sendError(res, error, "PLACE ORDER ERROR:");
  }
};

export const userOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId }).sort({ date: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    sendError(res, error, "USER ORDERS ERROR:");
  }
};

export const allOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("userId", "name email")
      .sort({ date: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    sendError(res, error, "ALL ORDERS ERROR:");
  }
};
export const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    if (!mongoose.isValidObjectId(orderId)) throw badRequest("Invalid order id");
    if (!ORDER_STATUSES.includes(status)) throw badRequest("Invalid status");

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.status = status;

    // COD ka paisa delivery pe milta hai
    if (status === "Delivered" && order.paymentMethod === "COD") {
      order.payment = true;
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: "Status Updated Successfully",
      order,
    });
  } catch (error) {
    sendError(res, error, "UPDATE STATUS ERROR:");
  }
};

export const placeOrderRazorpay = async (req, res) => {
  try {
    const { items, address } = req.body;

    if (!validAddress(address)) throw badRequest("Address is required");

    const { orderItems, subtotal } = await buildOrderItems(items);
    const amount = subtotal + DELIVERY_FEE;

    const newOrder = await Order.create({
      userId: req.userId,
      items: orderItems,
      amount,
      address,
      paymentMethod: "Razorpay",
      payment: false,
      status: "Pending Payment",
    });

    const razorpayOrder = await razorpayInstance.orders.create({
      amount: Math.round(amount * 100),
      currency,
      receipt: newOrder._id.toString(),
    });

    newOrder.razorpayOrderId = razorpayOrder.id;
    await newOrder.save();

    return res.status(200).json({
      success: true,
      key: process.env.RAZORPAY_KEY_ID,
      order: razorpayOrder,
    });
  } catch (error) {
    sendError(res, error, "RAZORPAY ERROR:");
  }
};

export const verifyRazorpay = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    if (
      ![razorpay_order_id, razorpay_payment_id, razorpay_signature].every(
        (v) => typeof v === "string" && v
      )
    ) {
      throw badRequest("Invalid payment data");
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const a = Buffer.from(generatedSignature);
    const b = Buffer.from(razorpay_signature);

    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
      return res.status(400).json({
        success: false,
        message: "Payment Verification Failed",
      });
    }

    // sirf isi user ka order
    const order = await Order.findOne({
      razorpayOrderId: razorpay_order_id,
      userId: req.userId,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order Not Found",
      });
    }

    if (!order.payment) {
      order.payment = true;
      order.status = "Order Placed";
      order.razorpayPaymentId = razorpay_payment_id;
      await order.save();
    }

    return res.status(200).json({
      success: true,
      message: "Payment Successful",
      order,
    });
  } catch (error) {
    sendError(res, error, "VERIFY ERROR:");
  }
};
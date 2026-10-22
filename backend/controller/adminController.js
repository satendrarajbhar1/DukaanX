import Product from "../model/productModel.js";
import Order from "../model/orderModel.js";

export const getDashboardData = async (req, res) => {
  try {
    const [totalProducts, totalOrders, recentOrders, latestProducts, revenueAgg, pendingOrders] =
      await Promise.all([
        Product.countDocuments(),
        Order.countDocuments(),
        Order.find({}).sort({ date: -1 }).limit(5),
        Product.find({}).sort({ date: -1 }).limit(5),
        Order.aggregate([
          { $match: { payment: true } },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ]),
        Order.countDocuments({
          status: { $nin: ["Delivered", "Cancelled", "Pending Payment"] },
        }),
      ]);

    res.status(200).json({
      success: true,
      stats: {
        products: totalProducts,
        orders: totalOrders,
        revenue: revenueAgg[0]?.total || 0,
        pending: pendingOrders,
      },
      recentOrders,
      latestProducts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
  try {
    const token = req.cookies.adminToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Admin Login Required",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.email !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({
        success: false,
        message: "Access Denied",
      });
    }

    req.admin = decoded;

    next();
  } catch (error) {
    console.log("Admin Auth Error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid Admin Token",
    });
  }
};

export default adminAuth;

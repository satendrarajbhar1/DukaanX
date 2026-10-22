import User from "../model/userModel.js";

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User is not found",
      });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: `getCurrentUser error ${error.message}`,
    });
  }
};

export const getAdmin = async (req, res) => {
  try {
    if (!req.admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    return res.status(200).json({
      success: true,
      email: req.admin.email,
      role: "admin",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Get admin error: ${error.message}`,
    });
  }
};

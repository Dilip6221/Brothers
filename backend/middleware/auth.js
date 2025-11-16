const { User } = require("../model/User");
const jwt = require("jsonwebtoken");

const authUser = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.json({ success: false, message: "User not authenticated" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) return res.json({ success: false, message: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    return res.json({
      success: false,
      message: "Unauthorized - Invalid or expired token",
    });
  }
};

// ✅ OPTIONAL AUTH (no token required)
const authOptional = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");
      } catch (err) {
        req.user = null;
      }
    }
    next();
  } catch (error) {
    req.user = null;
    next();
  }
};

module.exports = {authUser,authOptional};

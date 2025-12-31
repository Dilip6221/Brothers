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
/* Android Authentication Middleware */
const authForAndroid = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.json({ success: false, message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.json({
      success: false,
      message: "Unauthorized - Invalid or expired token",
    });
  }
};

module.exports = {authUser,authOptional,authForAndroid};

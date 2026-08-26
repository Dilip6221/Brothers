const crypto = require("crypto");

const COOKIE_NAME = "csrfToken";
const HEADER_NAME = "x-csrf-token";
const unsafeMethods = new Set(["POST", "PUT", "PATCH", "DELETE"]);

function csrfProtection(req, res, next) {
  let token = req.cookies?.[COOKIE_NAME];
  if (!token) {
    token = crypto.randomBytes(32).toString("hex");
    res.cookie(COOKIE_NAME, token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });
  }

  if (unsafeMethods.has(req.method)) {
    const suppliedToken = req.get(HEADER_NAME);
    if (!suppliedToken || suppliedToken !== token) {
      return res.status(403).json({ success: false, message: "Invalid CSRF token" });
    }
  }
  return next();
}

module.exports = { csrfProtection, COOKIE_NAME };

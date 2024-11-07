const jwt = require("jsonwebtoken");

// admin authentication middleware
const authAdmin = async (req, res, next) => {
  try {
    const { atoken } = req.headers;
    if (!atoken) {
      return res.json({
        success: false,
        message: "Not Authorized. Login Again.",
      });
    }
    const token_decode = jwt.verify(atoken, process.env.JWT_SECRET);

    if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
      return res.json({
        success: false,
        message: "Not Authorized. Login Again.",
      });
    }
    next();
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการตรวจสอบสิทธิ์ Admin:", error);
    return res
      .status(500)
      .json({ error: true, message: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์" });
  }
};

// Export authAdmin middleware using CommonJS
module.exports = authAdmin;

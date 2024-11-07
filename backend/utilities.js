const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401); // ถ้าไม่มี token ให้คืนค่า 401 Unauthorized

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(401); // ถ้า verify token ไม่ผ่าน ให้คืนค่า 401 Unauthorized
    req.user = user; // ส่งข้อมูล user ไปยัง request object
    next(); // ถ้าผ่านการตรวจสอบแล้ว ให้ไปที่ middleware ถัดไป
  });
}

// ฟังก์ชันสำหรับตรวจสอบว่า user เป็น Admin หรือไม่
function authorizeAdmin(req, res, next) {
  const { user } = req;

  // ตรวจสอบว่า role ของ user เป็น "Admin" หรือไม่
  if (user.role !== "Admin") {
    return res.status(403).json({
      error: true,
      message: "คุณไม่มีสิทธิ์ในการเข้าถึง",
    });
  }

  // ถ้า user เป็น Admin ให้ทำงานต่อ
  next();
}

module.exports = {
  authenticateToken,
  authorizeAdmin, // ส่งออกฟังก์ชัน authorizeAdmin ด้วย
};

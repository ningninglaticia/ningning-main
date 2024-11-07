const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

const addAdvisor = async (req, res) => {
  try {
    const { titleName, fullName, email, password } = req.body;

    // ตรวจสอบว่าทุกฟิลด์มีค่าหรือไม่
    if (!titleName || !fullName || !email || !password) {
      return res
        .status(400)
        .json({ error: true, message: "ทุกฟิลด์จำเป็นต้องกรอก" });
    }

    // ตรวจสอบว่าผู้ใช้งานมีอยู่แล้วหรือไม่
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: true, message: "ผู้ใช้งานนี้มีอยู่แล้ว" });
    }

    // เข้ารหัสรหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, 10);

    // สร้างผู้ใช้งานใหม่
    const newUser = new User({
      titleName,
      fullName,
      email,
      password: hashedPassword,
      role: "Advisor", // กำหนด role เป็น "Advisor"
    });

    // บันทึกข้อมูลผู้ใช้ใหม่
    await newUser.save();

    return res.json({
      error: false,
      user: newUser,
      message: "เพิ่ม Advisor เรียบร้อยแล้ว",
    });
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการเพิ่ม Advisor:", error);
    return res
      .status(500)
      .json({ error: true, message: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์" });
  }
};

// API for admin login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {

      const token = jwt.sign(email+password,process.env.JWT_SECRET)
      res.json({success:true,token})
    } else  {
      res.json({success:false, message:"Invalid credentials"})
    }
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการเพิ่ม Advisor:", error);
    return res
      .status(500)
      .json({ error: true, message: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์" });
  }
};

module.exports = { addAdvisor, loginAdmin };

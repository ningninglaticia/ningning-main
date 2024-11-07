const express = require("express");
const router = express.Router();

// import authAdmin middleware (ถ้ามี)
const authAdmin = require("../middlewares/authAdmin");

// import controller ที่ใช้ในการเพิ่ม Advisor
const adminController = require("../controllers/adminController");  // เพิ่มการ import controller

// ตัวอย่าง route POST ที่ใช้เพิ่ม Advisor
router.post("/add-advisor", authAdmin, adminController.addAdvisor);

router.post("/login", adminController.loginAdmin);

module.exports = router;

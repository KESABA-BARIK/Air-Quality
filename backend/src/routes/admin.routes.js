const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");

// ✅ Make sure loginAdmin is actually defined and imported
router.post("/login", adminController.loginAdmin);
router.get("/reports", adminController.getReportsByAdminEmail);

module.exports = router;

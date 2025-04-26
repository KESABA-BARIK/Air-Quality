const express = require("express");
const router = express.Router();
const userReportController = require("../controllers/userreport.controller");

router.post("/", userReportController.createReport);
router.get("/", userReportController.getAllReports);
router.get("/:reportId", userReportController.getReportById);
router.delete("/:reportId", userReportController.deleteReport);

module.exports = router;

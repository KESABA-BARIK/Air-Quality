const express = require("express");
const router = express.Router();
const factoryController = require("../controllers/factoryanalysis.controller");

router.post("/analyze", factoryController.analyzeFactory);
router.get("/", factoryController.getAllAnalysis); // ✅ No ()

module.exports = router;

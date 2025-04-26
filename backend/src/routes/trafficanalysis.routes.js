const express = require("express");
const router = express.Router();
const controller = require("../controllers/trafficanalysis.controller");

// Standard traffic analysis routes (if applicable)
router.get("/", controller.getAll);
router.post("/", controller.create);
router.get("/:id", controller.getById);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

// 🔥 Route for AQI-based route analysis
router.post("/analyze-route", controller.analyzeTrafficRoute);

module.exports = router;

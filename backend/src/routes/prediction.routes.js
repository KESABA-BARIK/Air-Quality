const express = require("express");
const router = express.Router();
const predictionController = require("../controllers/prediction.controller");

router.post("/aqi", predictionController.predictAQI);

module.exports = router;

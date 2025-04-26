const express = require("express");
const router = express.Router();
const {
  getAllCityPollution,
  createCityPollution
} = require("../controllers/citypollution.controller");

router.get("/", getAllCityPollution);
router.post("/", createCityPollution);

module.exports = router;

const express = require("express");
const userController = require("../controllers/user.controller");

const router = express.Router();

router.use("/", userController);

module.exports = router;

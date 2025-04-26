const express = require("express");
const router = express.Router();
const chatbotController = require("../controllers/chatbot.controller");

router.post("/ask", chatbotController.askChatbot);

module.exports = router;

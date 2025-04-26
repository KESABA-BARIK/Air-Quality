const { askAI } = require("../repository/chatbot.repository");

async function getChatbotResponse(message) {
  return await askAI(message);
}

module.exports = { getChatbotResponse };

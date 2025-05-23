const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
  userMessage: String,
  botResponse: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Chat', ChatSchema);

const dotenv = require("dotenv");
dotenv.config();

const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // From OpenRouter
  baseURL: "https://openrouter.ai/api/v1",
});

const askChatbot = async (req, res) => {
  const { message } = req.body;
  console.log("📩 Incoming message:", message);

  const allowedKeywords = ["factory", "factories", "pollution", "air quality", "aqi", "emissions", "air"];
  const isRelevant = allowedKeywords.some((keyword) =>
    message.toLowerCase().includes(keyword)
  );

  if (!isRelevant) {
    return res.status(400).json({
      error: "❌ Only queries related to factories, pollution, or air quality are allowed.",
    });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
    });

    const reply = response.choices[0].message.content;
    console.log("💬 OpenAI response:", reply);

    res.json({ response: reply });
  } catch (err) {
    console.error("❌ Chatbot error:", err.message);
    res.status(500).json({ error: "Chatbot failed to respond." });
  }
};

module.exports = { askChatbot };

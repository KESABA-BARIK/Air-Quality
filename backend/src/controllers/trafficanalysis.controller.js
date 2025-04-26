const trafficService = require("../services/trafficanalysis.service");
const axios = require("axios");
const OpenAI = require("openai");
const dotenv = require("dotenv");
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

async function getAQI(city) {
  try {
    const response = await axios.get(`https://api.waqi.info/feed/${city}/?token=${process.env.WAQI_TOKEN}`);
    if (response.data.status === "ok") {
      return response.data.data.aqi;
    } else {
      console.log(`No AQI data for ${city}`);
      return null;
    }
  } catch (error) {
    console.error(`Failed to fetch AQI for ${city}: ${error.message}`);
    return null;
  }
}

async function getIntermediateAreas(source, destination) {
  const prompt = `
List the possible areas along the route from "${source}" to "${destination}" in India.
Return only this format:
[
  { "area": "Area Name" },
  { "area": "Another Area" }
]
Only return JSON, no explanation.
`;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2,
  });

  const content = response.choices[0].message.content.trim();

  // Safely extract just the JSON part
  const jsonStart = content.indexOf("[");
  const jsonEnd = content.lastIndexOf("]") + 1;
  const jsonStr = content.substring(jsonStart, jsonEnd);

  return JSON.parse(jsonStr);
}

const analyzeTrafficRoute = async (req, res) => {
  const { source, destination } = req.body;

  if (!source || !destination) {
    return res.status(400).json({ error: "Source and destination required." });
  }

  try {
    const areas = await getIntermediateAreas(source, destination);

    let aqiResults = [];

    for (const area of areas) {
      const aqi = await getAQI(area.area);
      if (aqi !== null) {
        aqiResults.push({ area: area.area, aqi });
      }
    }

    const highAQI = aqiResults.some(result => result.aqi > 110);
    const message = highAQI ? "More pollution, avoid that route." : "Route is safe to go.";

    res.json({ aqiResults, message });
  } catch (error) {
    console.error("❌ Error analyzing route:", error.message);
    res.status(500).json({ error: "Failed to process AQI route analysis." });
  }
};

module.exports = {
  getAll: async (req, res) => res.json(await trafficService.getAll()),
  create: async (req, res) => res.json(await trafficService.create(req.body)),
  getById: async (req, res) => res.json(await trafficService.getById(req.params.id)),
  update: async (req, res) => res.json(await trafficService.update(req.params.id, req.body)),
  delete: async (req, res) => {
    await trafficService.delete(req.params.id);
    res.json({ message: "Deleted" });
  },
  analyzeTrafficRoute,
};

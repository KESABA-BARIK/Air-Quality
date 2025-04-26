const axios = require('axios');

// Simulate AI decision logic
function analyzeRisk(emissionsLevel, aqi) {
  if (aqi > 160 || emissionsLevel > 160) return "Critical"
  if (aqi > 150 || emissionsLevel > 120) return "Danger";
  if (aqi > 100 || emissionsLevel > 80) return "Warning";
  return "Normal";
}

async function getAQI(city) {
  try {
    const url = `https://api.waqi.info/feed/${city}/?token=${process.env.WAQI_TOKEN}`;
    const response = await axios.get(url);
    const aqi = response?.data?.data?.aqi;
    return typeof aqi === "number" ? aqi : 0;
  } catch (err) {
    console.error("❌ AQI fetch failed:", err.message);
    return 0; // default/fallback
  }
}

module.exports = { analyzeRisk, getAQI };

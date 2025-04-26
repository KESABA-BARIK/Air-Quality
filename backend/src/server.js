require("dotenv").config(); // Load environment variables
const app = require("./app");
const { getAndSaveCityAQIData } = require("./services/citypollution.service");


const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);

  // Fetch AQI data immediately on server start
  getAndSaveCityAQIData();

  // Then schedule it every 10 minutes
  setInterval(getAndSaveCityAQIData, 1 * 60 * 1000);
});

const FactoryAnalysis = require("../model/factoryanalysis.model");
const { getAQI, analyzeRisk } = require("../services/factoryanalysis.service");

exports.analyzeFactory = async (req, res) => {
  try {
    const { factoryName, location, emissionsLevel } = req.body;

    const aqi = await getAQI(location);
    const alert = analyzeRisk(emissionsLevel, aqi);

    const record = await FactoryAnalysis.create({
      factoryName,
      location,
      emissionsLevel,
      aqi,
      alert
    });

    res.status(201).json(record);
  } catch (err) {
    console.error("❌ Error in analyzeFactory:", err.message);
    res.status(500).json({ error: "AI Analysis failed" });
  }
};

exports.getAllAnalysis = async (req, res) => {
  try {
    const data = await FactoryAnalysis.findAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Error fetching data" });
  }
};

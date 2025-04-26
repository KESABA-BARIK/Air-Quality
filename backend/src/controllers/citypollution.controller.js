const { getAndSaveCityAQIData } = require("../services/citypollution.service");
const { getAllCityAQIData } = require("../repositories/citypollution.repository");

const getAllCityPollution = async (req, res) => {
  try {
    const data = await getAllCityAQIData();
    res.status(200).json({ status: "success", data });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

const createCityPollution = async (req, res) => {
  try {
    const data = await getAndSaveCityAQIData();
    res.status(200).json({ status: "success", data });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

module.exports = {
  getAllCityPollution,
  createCityPollution
};

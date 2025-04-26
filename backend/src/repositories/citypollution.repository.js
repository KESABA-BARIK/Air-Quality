const CityAQI = require("../model/citypollution.model");

const getAllCityAQIData = async () => {
  return await CityAQI.findAll(); // or any specific query logic
};

const saveCityAQIData = async (dataArray) => {
  for (const data of dataArray) {
    await CityAQI.upsert(data); // or create depending on your logic
  }
};

module.exports = {
  getAllCityAQIData,
  saveCityAQIData
};

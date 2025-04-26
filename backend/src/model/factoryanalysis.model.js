const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const FactoryAnalysis = sequelize.define("FactoryAnalysis", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  factoryName: { type: DataTypes.STRING, allowNull: false },
  location: { type: DataTypes.STRING, allowNull: false },
  emissionsLevel: { type: DataTypes.FLOAT, allowNull: false },
  aqi: { type: DataTypes.INTEGER }, // fetched AQI
  alert: { type: DataTypes.STRING }, // Normal, Warning, Danger
  recordedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

module.exports = FactoryAnalysis;

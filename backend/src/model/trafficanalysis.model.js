const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const TrafficAnalysis = sequelize.define("TrafficAnalysis", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  location: { type: DataTypes.STRING, allowNull: false },
  vehicleCount: { type: DataTypes.INTEGER },
  pollutionContribution: { type: DataTypes.FLOAT },
  recordedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

module.exports = TrafficAnalysis;

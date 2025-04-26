const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const UserReport = sequelize.define("UserReport", {
  reportId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = UserReport;

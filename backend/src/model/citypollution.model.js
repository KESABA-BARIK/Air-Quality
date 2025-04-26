const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const CityAQI = sequelize.define("CityAQI", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  city: {
    type: DataTypes.STRING
  },
  station: {
    type: DataTypes.STRING
  },
  aqi: {
    type: DataTypes.FLOAT
  },
  recordedTime: {
    type: DataTypes.STRING
  },
  location: {
    type: DataTypes.STRING
  }
}, {
  indexes: [
    {
      unique: true,
      fields: ['city', 'station'] 
    }
  ],
  timestamps: true 
});

module.exports = CityAQI;

const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const User = sequelize.define("Admin", {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  location: { type: DataTypes.STRING, allowNull: false, }
});

module.exports = User;
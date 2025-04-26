const db = require("../config/db.config");
const Admin = db.admin;

exports.findByEmail = async (email) => {
  return await Admin.findOne({ where: { email } });
};

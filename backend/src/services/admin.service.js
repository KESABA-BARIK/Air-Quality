const adminRepository = require("../repositories/admin.repository");
const userReportRepository = require("../repositories/userreport.repository");

const emailToCityMap = {
  "delhiadmin@aqi.com": "Delhi",
  "chennaiadmin@aqi.com": "Chennai",
  "puducherryadmin@aqi.com": "Puducherry",
  "mumbaiadmin@aqi.com": "Mumbai",
};

exports.getReportsByAdminEmail = async (email) => {
  const city = emailToCityMap[email];
  if (!city) throw new Error("Unauthorized or invalid admin");

  return await userReportRepository.getReportsByCity(city);
};

exports.deleteUserReport = async (reportid) => {
  return await userReportRepository.delete(reportid);
};

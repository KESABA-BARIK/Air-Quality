const UserReport = require("../model/userreport.model");

exports.createReport = async (reportData) => {
  return await UserReport.create(reportData);
};

exports.getAllReports = async () => {
  return await UserReport.findAll();
};

exports.getReportsByCity = async (city) => {
  return await UserReport.findAll({ where: { location: city } });
};

exports.getReportById = async (reportId) => {
  return await UserReport.findOne({ where: { reportId } });
};

exports.deleteReport = async (reportid) => {
  const report = await UserReport.findOne({ where: { reportid } });
  if (report) {
    await report.destroy();
    return true;
  }
  return false;
};

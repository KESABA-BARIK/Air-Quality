const userReportRepo = require("../repositories/userreport.repository");

exports.createReport = (reportData) => {
  return userReportRepo.createReport(reportData);
};

exports.getAllReports = () => {
  return userReportRepo.getAllReports();
};

exports.getReportById = (reportid) => {
  return userReportRepo.getReportById(reportid);
};

exports.deleteReport = (reportid) => {
  return userReportRepo.deleteReport(reportid);
};

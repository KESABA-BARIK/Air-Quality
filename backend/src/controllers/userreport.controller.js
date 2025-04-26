const userReportService = require("../services/userreport.service");

exports.createReport = async (req, res) => {
  try {
    const report = await userReportService.createReport(req.body);
    res.status(201).json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllReports = async (req, res) => {
  try {
    const reports = await userReportService.getAllReports();
    res.status(200).json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getReportById = async (req, res) => {
  try {
    const report = await userReportService.getReportById(req.params.reportId);
    if (report) {
      res.status(200).json(report);
    } else {
      res.status(404).json({ message: "Report not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteReport = async (req, res) => {
  try {
    const success = await userReportService.deleteReport(req.params.reportId);
    if (success) {
      res.status(200).json({ message: "Report deleted successfully" });
    } else {
      res.status(404).json({ message: "Report not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const db = require("../config/db.config");
const FactoryAnalysis = db.factoryanalysis;

exports.create = async (data) => await FactoryAnalysis.create(data);
exports.findAll = async () => await FactoryAnalysis.findAll();
exports.findByCity = async (city) => await FactoryAnalysis.findAll({ where: { city } });

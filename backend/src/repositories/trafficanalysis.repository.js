const TrafficAnalysis = require("../model/trafficanalysis.model");

class TrafficAnalysisRepository {
  async findAll() {
    return await TrafficAnalysis.findAll();
  }

  async findById(id) {
    return await TrafficAnalysis.findByPk(id);
  }

  async create(data) {
    return await TrafficAnalysis.create(data);
  }

  async update(id, data) {
    return await TrafficAnalysis.update(data, { where: { id } });
  }

  async delete(id) {
    return await TrafficAnalysis.destroy({ where: { id } });
  }
}

module.exports = new TrafficAnalysisRepository();

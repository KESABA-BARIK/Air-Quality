const repo = require("../repositories/trafficanalysis.repository");

class TrafficService {
  async getAll() {
    return await repo.findAll();
  }

  async getById(id) {
    return await repo.findById(id);
  }

  async create(data) {
    return await repo.create(data);
  }

  async update(id, data) {
    return await repo.update(id, data);
  }

  async delete(id) {
    return await repo.delete(id);
  }
}

module.exports = new TrafficService();

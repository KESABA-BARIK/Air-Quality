const userRepo = require("../repositories/user.repository");

class UserService {
  async getAllUsers() {
    return await userRepo.findAll();
  }

  async getUserById(id) {
    return await userRepo.findById(id);
  }

  async getUserByEmail(email) {
    return await userRepo.findByEmail(email);
  }

  async createUser(data) {
    return await userRepo.create(data);
  }

  async updateUser(id, data) {
    return await userRepo.update(id, data);
  }

  async deleteUser(id) {
    return await userRepo.delete(id);
  }
}

module.exports = new UserService();

const { User } = require('../models/models');
const ApiError = require('../error/apiError');

class AdminService {
  async getAllUsers() {
    const users = await User.findAll();
    return users;
  }
}

module.exports = new AdminService();

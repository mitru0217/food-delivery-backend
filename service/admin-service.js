const bcrypt = require('bcrypt');
const { User } = require('../models/user-model');
const { Admin } = require('../models/admin-model');
const ApiError = require('../error/apiError');
const adminTokenService = require('../service/admin-token-service');
const { generateAndSaveTokens } = require('../utils/generateAndSaveTokens');

class AdminService {
  async register(name, email, password) {
    //checking if there name, email or password
    if (!name || !email || !password) {
      throw ApiError.badRequest('Incorrect email or password');
    }
    // Cheking the user for presence in the database
    const candidate = await Admin.findOne({ where: { email } });

    if (candidate) {
      throw ApiError.badRequest('A User with this email already exists');
    }
    //hash the password
    const hashPassword = await bcrypt.hash(password, 3);

    // Create a new user
    const user = await Admin.create({
      name,
      email,
      password: hashPassword,
    });

    return generateAndSaveTokens(user, adminTokenService);
  }
  async login(email, password) {
    const user = await Admin.findOne({ where: { email } });
    if (!user) {
      throw ApiError.badRequest('User was not found');
    }
    //Compare pass in DB and incoming pass
    const isPassEquals = await bcrypt.compare(password, user.password);
    if (!isPassEquals) {
      throw ApiError.badRequest('Incorrect password');
    }

    return generateAndSaveTokens(user, adminTokenService);
  }
  //The logout() function uses the removeToken() function to delete the token based on the refreshToken
  async logout(refreshToken) {
    try {
      const deletedToken = await adminTokenService.removeToken(refreshToken);
      return { deletedToken };
    } catch (error) {
      throw ApiError.internal('Logout failed: ' + error.message);
    }
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.unauthorized();
    }
    //validate token
    const userData = adminTokenService.validateRefreshToken(refreshToken);
    //looking for token in DB
    const tokenFromDB = await adminTokenService.findToken(refreshToken);
    if (!userData || !tokenFromDB) {
      throw ApiError.unauthorized();
    }
    const user = await Admin.findByPk({ where: userData.id });

    return generateAndSaveTokens(user, adminTokenService);
  }

  async getAllUsersForAdmin() {
    //Find  all users with the role 'ADMIN'
    const admins = await Admin.findAll({
      where: { role: 'ADMIN' },
    });
    //Create a variable allUsers and assign it an empty array
    const allUsers = [];

    if (admins.length > 0) {
      // for each user:'Admin'  we get all users from User
      for (const admin of admins) {
        const users = await User.findAll();
        allUsers.push(...users);
      }
      return allUsers;
    } else {
      // If users: 'Admin' are not found, return error
      throw ApiError.adminNotFound('Users with role: "ADMIN" are not found');
    }
  }
}

module.exports = new AdminService();

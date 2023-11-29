const bcrypt = require('bcrypt');
const { User } = require('../models/user-model');
const ApiError = require('../error/apiError');
const tokenService = require('../service/token-service');
const { generateAndSaveTokens } = require('../utils/generateAndSaveTokens');

class UserService {
  async register(name, email, password) {
    //checking if there name, email or password
    if (!name || !email || !password) {
      throw ApiError.badRequest('Incorrect email or password');
    }
    // Cheking the user for presence in the database
    const candidate = await User.findOne({ where: { email } });

    if (candidate) {
      throw ApiError.badRequest('A User with this email already exists');
    }
    //hash the password
    const hashPassword = await bcrypt.hash(password, 3);

    // Create a new user
    const user = await User.create({
      name,
      email,
      password: hashPassword,
    });

    return generateAndSaveTokens(user, tokenService);
  }
  async login(email, password) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw ApiError.badRequest('User was not found');
    }
    //Compare pass in DB and incoming pass
    const isPassEquals = await bcrypt.compare(password, user.password);
    if (!isPassEquals) {
      throw ApiError.badRequest('Incorrect password');
    }

    return generateAndSaveTokens(user, tokenService);
  }
  //The logout() function uses the removeToken() function to delete the token based on the refreshToken
  async logout(refreshToken) {
    try {
      const deletedToken = await tokenService.removeToken(refreshToken);
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
    const userData = tokenService.validateRefreshToken(refreshToken);
    //looking for token in DB
    const tokenFromDB = await tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDB) {
      throw ApiError.unauthorized();
    }
    const user = await User.findByPk({ where: userData.id });

    return generateAndSaveTokens(user, tokenService);
  }
}
module.exports = new UserService();

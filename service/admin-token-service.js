const jwt = require('jsonwebtoken');
const { AdminToken } = require('../models/admin-model');

class AdminTokenService {
  generateTokens(payload) {
    //generate access token
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET_ADMIN, {
      expiresIn: '180m',
    });
    //generate refresh token
    const refreshToken = jwt.sign(
      payload,
      process.env.JWT_REFRESH_SECRET_ADMIN,
      {
        expiresIn: '60d',
      }
    );
    return {
      accessToken,
      refreshToken,
    };
  }
  //Validate tokens
  validateAccessToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET_ADMIN);
      return userData;
    } catch (e) {
      return null;
    }
  }
  validateRefreshToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET_ADMIN);
      return userData;
    } catch (e) {
      return null;
    }
  }
  // the function  saves a refresh token in the database for a specific user
  async saveToken(userId, refreshToken) {
    //find a token using this id
    const tokenData = await AdminToken.findOne({ where: { userID: userId } });
    // if the token exist, then overwrite the token
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }
    // if the user registers for the first time, then this token must be created
    const token = AdminToken.create({ userID: userId, refreshToken });
    return token;
  }
  //This function uses Sequelize's destroy method on the Token model to delete records that match the condition
  //specified in the where clause. The refreshToken field is used to find and delete the corresponding token records
  async removeToken(refreshToken) {
    const deletedToken = await AdminToken.destroy({ where: { refreshToken } });
    return deletedToken; // Returns the number of deleted tokens
  }
  //Looking for token in DB
  async findToken(refreshToken) {
    const tokenData = await AdminToken.findOne({ where: { refreshToken } });
    return tokenData; // Returns the number of deleted tokens
  }
}

module.exports = new AdminTokenService();

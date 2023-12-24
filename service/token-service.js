const jwt = require('jsonwebtoken');
const { Token } = require('../models/user-model');

class TokenService {
  generateTokens(payload) {
    //generate access token
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: '60m',
    });
    //generate refresh token
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: '60d',
    });
    return {
      accessToken,
      refreshToken,
    };
  }
  //Validate tokens
  validateAccessToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      return userData;
    } catch (e) {
      // Если токен истек, создаем новый access token с помощью refresh token
      if (
        e.name === 'TokenExpiredError' &&
        this.validateRefreshTokenExists(userData)
      ) {
        const newAccessToken = jwt.sign(
          payload,
          process.env.JWT_ACCESS_SECRET,
          {
            expiresIn: '60m',
          }
        );
        return { accessToken: newAccessToken };
      }
      return null;
    }
  }
  validateRefreshToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      return userData;
    } catch (e) {
      return null;
    }
  }
  //Этот метод проверяет, существует ли refreshToken для данного пользователя в базе данных.
  async validateRefreshTokenExists(userData) {
    const tokenData = await Token.findOne({
      where: { userID: userData.userId },
    });
    return !!tokenData;
  }
  // the function  saves a refresh token in the database for a specific user
  async saveToken(userId, refreshToken) {
    //find a token using this id
    const tokenData = await Token.findOne({ where: { userID: userId } });
    // if the token exist, then overwrite the token
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }
    // if the user registers for the first time, then this token must be created
    const token = Token.create({ userID: userId, refreshToken });
    return token;
  }
  //This function uses Sequelize's destroy method on the Token model to delete records that match the condition
  //specified in the where clause. The refreshToken field is used to find and delete the corresponding token records
  async removeToken(refreshToken) {
    const deletedToken = await Token.destroy({ where: { refreshToken } });
    return deletedToken; // Returns the number of deleted tokens
  }
  //Looking for token in DB
  async findToken(refreshToken) {
    const tokenData = await Token.findOne({ where: { refreshToken } });
    return tokenData; // Returns the number of deleted tokens
  }
}

module.exports = new TokenService();

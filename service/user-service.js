const bcrypt = require('bcrypt');
const cloudinary = require('cloudinary').v2;
const fs = require('fs/promises');
const { User } = require('../models/user-model');
const ApiError = require('../error/apiError');
const tokenService = require('../service/token-service');
const { generateAndSaveTokens } = require('../utils/generateAndSaveTokens');
require('dotenv').config();

class UserService {
  constructor() {
    this.cloudinary = cloudinary;
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
      secure: true,
    });
  }
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
  // Функция для обновления  avatar  в модели User

  async updateAvatar(id, pathFile) {
    try {
      const user = await User.findByPk(id);
      if (!user) {
        // Обработка случая, если пользователь не найден
        throw new Error('User not found');
      }
      const { secure_url: avatar, public_id: idCloudAvatar } =
        await this.#uploadCloud(pathFile, id);
      const oldAvatar = await this.getAvatar(id);
      this.cloudinary.uploader.destroy(
        oldAvatar.idCloudAvatar,
        (err, result) => {
          console.log(err, result);
        }
      );
      await this.updateAvatarFromCloud(id, avatar, idCloudAvatar); // Вызов метода обновления изображения в базе данных
      await fs.unlink(pathFile);
      return avatar;
    } catch (error) {
      throw ApiError.internal('Error upload avatar: ' + error.message);
    }
  }

  #uploadCloud = (pathFile, id) => {
    return new Promise((resolve, reject) => {
      this.cloudinary.uploader.upload(
        pathFile,
        {
          folder: `food-delivery/avatars/${id}`,
          transformation: {
            width: 40,
            height: 40,
            crop: 'fill',
          },
        },
        (error, result) => {
          console.log(result);
          if (error) reject(error);
          if (result) resolve(result);
        }
      );
    });
  };
  async updateAvatarFromCloud(id, avatar, idCloudAvatar) {
    try {
      const user = await User.findByPk(id);
      if (!user) {
        throw new Error('User not found');
      }
      // Обновить информацию об аватаре пользователя
      await user.update({
        avatar,
        idCloudAvatar,
      });
      return user;
    } catch (error) {
      throw new Error('Failed to update avatar: ' + error.message);
    }
  }
  async getAvatar(id) {
    const { avatar, idCloudAvatar } = await User.findByPk(id);
    return { avatar, idCloudAvatar };
  }
}
module.exports = new UserService();

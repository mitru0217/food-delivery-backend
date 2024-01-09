const cloudinary = require('cloudinary').v2;
const fs = require('fs/promises');
const ApiError = require('../error/apiError');
const { Categories } = require('../models/admin-model');
require('dotenv').config();

class categoryService {
  constructor() {
    this.cloudinary = cloudinary;
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
      secure: true,
    });
  }
  async addCategory(name) {
    if (!name || name.trim() === '') {
      throw ApiError.badRequest('Incorrect name');
    }

    const existingCategory = await Categories.findOne({ where: { name } });

    if (existingCategory) {
      throw ApiError.badRequest('A Category with this name already exists');
    }

    try {
      const category = await Categories.create({ name, img: '' });
      console.log(category);
      return category.id;
    } catch (error) {
      console.error(error);
      // Обработка ошибки создания категории в базе данных
      throw ApiError.internal('Failed to create category');
    }
  }
  async updateCategoryImg(id, pathFile) {
    try {
      console.log('Received categoryId in updateCategoryImg:', id);
      const category = await Categories.findByPk(id);
      if (!category) {
        // Обработка случая, если пользователь не найден
        throw new Error('Category not found');
      }
      const { secure_url: categoryImg, public_id: idCloudCategoryImg } =
        await this.#uploadCloud(pathFile, id);

      const oldCategoryImg = await this.getCategoryImg(id);
      this.cloudinary.uploader.destroy(
        oldCategoryImg.idCloudCategoryImg,
        (err, result) => {
          console.log(err, result);
        }
      );
      await this.updateCategoryImgFromCloud(
        id,
        categoryImg,
        idCloudCategoryImg
      ); // Вызов метода обновления изображения в базе данных
      await fs.unlink(pathFile);
      return categoryImg;
    } catch (error) {
      throw ApiError.internal('Error upload img: ' + error.message);
    }
  }

  #uploadCloud = (pathFile, id) => {
    return new Promise((resolve, reject) => {
      this.cloudinary.uploader.upload(
        pathFile,
        {
          folder: `food-delivery/categories/${id}`,
          transformation: {
            width: 300,
            height: 300,
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
  async updateCategoryImgFromCloud(id, categoryImg, idCloudCategoryImg) {
    try {
      const category = await Categories.findByPk(id);
      if (!category) {
        throw new Error('Category not found');
      }
      // Обновить информацию об аватаре пользователя
      await category.update({
        categoryImg,
        idCloudCategoryImg,
      });
      return category;
    } catch (error) {
      throw new Error('Failed to update avatar: ' + error.message);
    }
  }
  async getCategoryImg(id) {
    const { categoryImg, idCloudCategoryImg } = await Categories.findByPk(id);
    return { categoryImg, idCloudCategoryImg };
  }
}

module.exports = new categoryService();

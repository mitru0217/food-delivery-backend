const categoryService = require('../service/category-service');
const ApiError = require('../error/apiError');

class CategoriesController {
  async createCategory(req, res, next) {
    try {
      const { name } = req.body;
      const categoryData = await categoryService.addCategory(name);

      return res.json(categoryData);
    } catch (error) {
      console.error(error);
      return res.status(500).json(ApiError.internal('Create mistake'));
    }
  }
  async categoryImg(req, res, next) {
    try {
      const id = req.params.categoryId;
      // Логирование для проверки полученного id
      console.log('File:', req.file);
      console.log('Received categoryId:', id);
      const pathFile = req.file.path;

      const url = await categoryService.updateCategoryImg(id, pathFile);
      return res.json({ status: 'success', imgUrl: url });
    } catch (e) {
      next(e);
    }
  }
  async getAllCategories(req, res) {
    try {
      const categories = await categoryService.findAll();
      return res.json(categories);
    } catch (err) {
      return res
        .status(500)
        .json(ApiError.internal('Ошибка при получении списка категорий'));
    }
  }
}

// async deleteCategory(req, res) {
//   const { categoryId } = req.params; // Предполагается, что вы получаете ID категории из URL
//   try {
//     const category = await Categories.findByPk(categoryId);

//     if (!category) {
//       return res.status(404).json(ApiError.notFound('Категория не найдена'));
//     }

//     await category.destroy();
//     return res.json({ message: 'Категория успешно удалена' });
//   } catch (err) {
//     return res
//       .status(500)
//       .json(ApiError.internal('Ошибка при удалении категории'));
//   }
// }

// }

module.exports = new CategoriesController();

const Router = require('express');
const router = new Router();
const categoryController = require('../controllers/categoryController');
const { categoryImgMiddleware } = require('../middleware/imgMiddleware');

router.post('/', categoryController.createCategory);
router.patch(
  '/:categoryId/image',
  categoryImgMiddleware,
  categoryController.categoryImg
);

router.get('/', categoryController.getAllCategories);
// router.delete('/:categoryId', categoryController.deleteCategory);

module.exports = router;

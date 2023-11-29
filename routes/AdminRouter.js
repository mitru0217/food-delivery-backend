const Router = require('express');
const { body } = require('express-validator');
const AdminController = require('../controllers/adminController');
const ApiError = require('../error/apiError');
const authMiddleware = require('../middleware/authMiddleware');

const router = new Router();
const adminController = new AdminController();

const validateInputs = [
  body('email').isEmail(),
  body('password').isLength({ min: 8, max: 10 }),
];
// register and login
router.post('/auth', validateInputs, async (req, res, next) => {
  const { action } = req.body;
  try {
    if (action === 'register') {
      await adminController.register(req, res, next);
    } else if (action === 'login') {
      await adminController.login(req, res, next);
    } else {
      throw ApiError.badRequest('Invalid action');
    }
  } catch (e) {
    next(e);
  }
});

router.post('/logout', adminController.logout); // remove refresh token

router.get('/refresh', adminController.refresh); //overwrite access token, if it's died

router.get('/users', authMiddleware, adminController.getUsers); //get all users

module.exports = router;

const Router = require('express');
const { body } = require('express-validator');
const UserController = require('../controllers/userController');
const ApiError = require('../error/apiError');
const { profileMiddleware } = require('../middleware/profileMiddleware');
const authUserMiddleware = require('../middleware/authUserMiddleware');

const router = new Router();
const userController = new UserController();

const validateInputs = [
  body('email').isEmail(),
  body('password').isLength({ min: 3, max: 10 }),
];
// register and login
router.post('/', validateInputs, async (req, res, next) => {
  const { action } = req.body;
  try {
    if (action === 'register') {
      await userController.register(req, res, next);
    } else if (action === 'login') {
      await userController.login(req, res, next);
    } else {
      throw ApiError.badRequest('Invalid action');
    }
  } catch (e) {
    next(e);
  }
});

// remove refresh token
router.post('/logout', userController.logout);

//overwrite access token, if it's died
router.get('/refresh', userController.refresh);

// add avatar
router.patch(
  '/avatar',
  authUserMiddleware,
  profileMiddleware,
  userController.avatar
);

module.exports = router;

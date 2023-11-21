const Router = require('express');
const UserController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = new Router();
const userController = new UserController();

router.post('/', userController.handleRegisterAndLogin);
router.get('/', authMiddleware, userController.check);

module.exports = router;

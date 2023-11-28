const Router = require('express');
const AdminController = require('../controllers/adminController');
const router = new Router();
const adminController = new AdminController();

router.get('/', adminController.getUsers); //get all users

module.exports = router;

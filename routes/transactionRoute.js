const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

router.route('/').post(userController.createUser);

router.route('/login').post(userController.login);

router.route('/deposit').post(userController.deposit);
router.route('/withdraw').post(userController.protect, userController.withdraw);
router.route('/transfer').post(userController.protect, userController.transfer);

module.exports = router;

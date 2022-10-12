const express = require('express');
const { protect } = require('../middleware/userAuthMiddleware');
const userController = require('../controllers/userController');
const router = express.Router();

router.route('/').post(userController.createUser);

router.route('/login').post(userController.login);

router.route('/deposit').post(protect, userController.deposit);
router.route('/withdraw').post(protect, userController.withdraw);
router.route('/transfer').post(protect, userController.transfer);

module.exports = router;

const express = require('express');
const userController=require("../controller/userController")
const { isAuthenticated,isAdminOrManager } = require('../middleware/auth');

const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/me', isAuthenticated, userController.getUser);
router.get('/getonlyuser', isAuthenticated, isAdminOrManager, userController.getonlyUsers);
router.get('/getalluser', isAuthenticated, isAdminOrManager, userController.getUsers);
router.put('/update/:id', isAuthenticated, isAdminOrManager, userController.updateUser);
router.get('/performance',isAuthenticated,userController.fetchuserPerformance);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password', userController.resetPassword);

module.exports = router;

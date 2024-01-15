const express = require('express');

const router = express.Router();
const reportsController = require('../controllers/user.controller');
const authController = require('../controllers/auth.controller')


router.get('/users', reportsController.getUsers); // GET all users
router.get('/users/:userId', authController.validateUUID,reportsController.getUserById); // GET user by userId
router.post('/users', reportsController.postUser); // POST create user
router.put('/users/:userId', authController.validateUUID,reportsController.updateUser); // PUT update user by userId
router.delete('/users/:userId', authController.validateUUID,reportsController.deleteUser); // DELETE user by userId


module.exports = router;
const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const cartRouter = require('../routes/cartRoutes');

const router = express.Router();

router.get('/getLoggedInStatus', authController.isLoggedInApi);

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// -- This basially Protects all d routes that comes after this middleware "line 👇"
router.use(authController.protect);

router.patch('/updateMyPassword', authController.updateMyPassword);
router.get('/me', userController.getMe, userController.getUser);
router.patch('/updateMe', userController.updateMe);
router.delete('/deleteMe', userController.deleteMe);

// restricts all the routes below to be accessed by only an "admin" after this middleware function
router.use(authController.restrictTo('admin'));

router.route('/').get(userController.getAllUser).post(userController.createUser);

router
    .route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;

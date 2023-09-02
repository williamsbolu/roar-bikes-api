const express = require('express');
const authController = require('../controllers/authController');
const savedItemController = require('../controllers/savedItemController');

const router = express.Router();

router.use(authController.protect);

router.get('/getUserSavedItems', savedItemController.getUserSavedItems);

router
    .route('/')
    .get(
        authController.restrictTo('admin', 'lead-asist'),
        savedItemController.getAllSavedItems
    )
    .post(savedItemController.creatSavedItem);

router.route('/:id').delete(savedItemController.deleteSavedItem);

module.exports = router;

const express = require('express');
const itemController = require('../controllers/itemController');
const authController = require('../controllers/authController');

const router = express.Router();

router
    .route('/recent-items')
    .get(itemController.aliasRecentItems, itemController.getAllItems);

router.route('/item/:slug').get(itemController.getItemSlug);

router
    .route('/')
    .get(itemController.getAllItems)
    .post(
        authController.protect,
        authController.restrictTo('admin', 'lead-asist'),
        itemController.createItem
    );

router
    .route('/:id')
    .get(itemController.getItem)
    .patch(
        authController.protect,
        authController.restrictTo('admin', 'lead-asist'),
        itemController.updateItem
    )
    .delete(
        authController.protect,
        authController.restrictTo('admin', 'lead-asist'),
        itemController.deleteItem
    );

module.exports = router;

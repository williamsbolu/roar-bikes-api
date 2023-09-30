const Item = require('../models/itemModel');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.aliasRecentItems = (req, res, next) => {
    req.query.collections = 'recent';
    next();
};

exports.getItemSlug = catchAsync(async (req, res, next) => {
    const item = await Item.findOne({ slug: req.params.slug });

    if (!item) {
        next(new AppError('There is no product with that name.', 404));
    }

    res.status(200).json({
        status: 'success',
        data: item,
    });
});

exports.getAllItems = factory.getAll(Item);
exports.getItem = factory.getOne(Item);
exports.createItem = factory.createOne(Item);
exports.updateItem = factory.updateOne(Item);
exports.deleteItem = factory.deleteOne(Item);

const SavedItem = require('../models/savedItemModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');

exports.getAllSavedItems = factory.getAll(SavedItem);
exports.deleteSavedItem = factory.deleteOne(SavedItem);
exports.creatSavedItem = factory.createOne(SavedItem, 'SavedItem');

exports.getUserSavedItems = catchAsync(async (req, res, next) => {
    // we get access to the req.user from the protect middleware
    const savedItems = await SavedItem.find({ user: req.user.id });

    // send response
    res.status(200).json({
        status: 'success',
        results: savedItems.length,
        data: {
            savedItems,
        },
    });
});

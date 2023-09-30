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

exports.importLocalWishlistData = catchAsync(async (req, res, next) => {
    const importedSavedItems = req.body;

    const savedItems = await SavedItem.find({ user: req.user.id });
    const existingsavedItemsIds = savedItems.map((data) => data.item._id); // array of existing cart "items" ids

    const filteredWishlistData = [];

    importedSavedItems.forEach((curItem) => {
        // the "savedItems" is a mongoose Document object, so i had to convert the itemId to a string for d comparism
        // We check if any savedItem data in the "importedSavedItems" exist in the database, then we push the items that do no exist to the database
        const itemExistInDatabase = existingsavedItemsIds.find(
            (itemId) => itemId.toString() === curItem.item
        );

        // push any saved item that dosen't exist before in the database, if existingsavedItemsIds is empty, find() retuns undefined for all interation
        if (!itemExistInDatabase) {
            filteredWishlistData.push(curItem);
        }
    });

    // console.log(filteredWishlistData);

    const updatedWishlist = await SavedItem.create(filteredWishlistData);

    res.status(200).json({
        status: 'success',
        data: updatedWishlist,
    });
});

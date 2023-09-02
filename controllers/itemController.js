const Item = require('../models/itemModel');
const APIFeatures = require('../utils/apiFeatures');
const factory = require('./handlerFactory');

exports.aliasRecentItems = (req, res, next) => {
    req.query.collections = 'recent';
    next();
};

exports.getAllItems = factory.getAll(Item);
exports.getItem = factory.getOne(Item);
exports.createItem = factory.createOne(Item);
exports.updateItem = factory.updateOne(Item);
exports.deleteItem = factory.deleteOne(Item);

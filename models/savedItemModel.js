const mongoose = require('mongoose');

const savedItemSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'A saved item must belong to a user'],
    },
    item: {
        type: mongoose.Schema.ObjectId,
        ref: 'Item',
        required: [true, 'The saved item must be specified'],
    },
});

savedItemSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'item',
        select: 'name imageCover price',
    });
    next();
});

const SavedItem = mongoose.model('SavedItemModel', savedItemSchema);
module.exports = SavedItem;

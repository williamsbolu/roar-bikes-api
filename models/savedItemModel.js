const mongoose = require('mongoose');
const slugify = require('slugify');

const savedItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A saved item must have a name'],
    },
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
    slug: String,
});

savedItemSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

savedItemSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'item',
        select: 'name imageCover price',
    });
    next();
});

const SavedItem = mongoose.model('SavedItem', savedItemSchema);
module.exports = SavedItem;

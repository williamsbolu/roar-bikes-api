const mongoose = require('mongoose');
const slugify = require('slugify');

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'An item must have a name'],
        trim: true,
        maxlength: [30, 'An item name must have less or equal than 30 characters'],
        minlength: [8, 'An item name must have more or equal than 8 characters'],
    },
    slug: String,
    imageCover: {
        type: String,
        required: [true, 'An item must have an image cover'],
    },
    description: String,
    price: {
        type: Number,
        required: [true, 'An item must have a price'],
    },
    type: {
        type: String,
        trim: true,
        required: [true, 'An item must have a type'],
        enum: {
            values: ['road-bike', 'mountain-bike', 'folding-bike'],
            message: 'type can be either: road-bikes, mountain-bikes or folding-bikes',
        },
    },
    collections: {
        type: String,
        required: [true, 'An item must have belong to a collection, if not use "none"'],
        enum: {
            values: ['recent', 'none', 'optional'],
            message: 'collection is either: recent, none or optional',
        },
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false, // permanently hides this field from the output
    },
    stock: {
        type: Number,
        required: [true, "An item must have the number of stock you're adding"],
        min: [1, 'Stock must be above 1.0'],
    },
});

itemSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;

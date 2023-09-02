const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'A cart item must belong to a user'],
    },
    item: {
        type: mongoose.Schema.ObjectId,
        ref: 'Item',
        required: [true, 'A cart item must belong to an item/products'],
    },
    price: {
        type: Number,
        required: [true, 'A cart item must have a price'],
    },
    quantity: {
        type: Number,
        default: 1,
    },
    itemPriceTotal: Number,
});

cartSchema.pre('save', function (next) {
    this.itemPriceTotal = this.price * this.quantity;
    next();
});

cartSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'item',
        select: 'name imageCover',
    });
    next();
});

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;

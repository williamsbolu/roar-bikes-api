const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true],
    },
    item: {
        type: mongoose.Schema.ObjectId,
        ref: 'Item',
        required: [true],
    },
    price: {
        type: Number,
        required: [true, 'Order must have a price.'],
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    paid: {
        type: Boolean,
        default: true,
    },
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;

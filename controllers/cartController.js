const Cart = require('../models/cartModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');

exports.getAllCartItems = factory.getAll(Cart);
// exports.getCartItem = factory.getOne(Cart);
exports.createCart = factory.createOne(Cart, 'Cart');
exports.deleteCartItem = factory.deleteOne(Cart);

exports.updateCartItem = catchAsync(async (req, res, next) => {
    const cartItem = await Cart.findById(req.params.id);
    cartItem.quantity = req.body.quantity;
    const updatedCartItem = await cartItem.save(); // save the updated field

    res.status(200).json({
        status: 'success',
        data: {
            updatedCartItem,
        },
    });
});

exports.getUserCartData = catchAsync(async (req, res, next) => {
    // we get access to the req.user from the protect middleware
    const cartItems = await Cart.find({ user: req.user.id });

    // send response
    res.status(200).json({
        status: 'success',
        results: cartItems.length,
        data: {
            cartItems,
        },
    });
});

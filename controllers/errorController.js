const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}`;

    return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
    // Object.values() returns an array
    const value = Object.values(err.keyValue)[0];
    console.log(value);

    const message = `Duplicate field value: ${value}.`;
    return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
    // Object.values() returns an array
    const errors = Object.values(err.errors).map((el) => el.message);

    const message = `Invalid input data. ${errors.join('. ')}. Please use another value!`;
    return new AppError(message, 400);
};

const handleJWTError = () => new AppError('Invalid Token. Please log in again!', 401);

const handleJWTExpiredError = () =>
    new AppError('Your token has expired! Please log in again.', 401);

const sendErrorDev = (err, res) => {
    // receives d res and error object fro the error middleware
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });
};

const sendErrorProd = (err, res) => {
    // Operational, trusted errors: send message to client
    if (err.isOperational) {
        res.status(err.statusCode).json({
            statusCode: err.statusCode,
            status: err.status,
            message: err.message,
        });

        // programming or other unknown errors: dont leak error details to client
    } else {
        // (1) Log error
        console.error('Error 💥', err);

        // (2) send generic message
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong!',
        });
    }
};

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        // in this block i was meant to clone the err object and use like d example below "error", but since im not using the err object elsewhere there no need for that
        // let error = { ...err };
        // error.name = err.name;
        // console.log(error);

        // CastError: error gotten from invalid id in mongoose (Get item)
        if (err.name === 'CastError') err = handleCastErrorDB(err);

        // Mongoose duplicate key/fields (Signup) unique fields
        if (err.code === 11000) err = handleDuplicateFieldsDB(err);

        // Mongoose validation error (update item)
        if (err.name === 'ValidationError') err = handleValidationErrorDB(err);

        // json web token error "jwt.verify()": Invalid Token
        if (err.name === 'JsonWebTokenError') err = handleJWTError();

        // json web token error "jwt.verify()": Expired Token
        if (err.name === 'TokenExpiredError') err = handleJWTExpiredError();

        sendErrorProd(err, res);
    }
};

// Errors coming from mongoose which we do not mark as operational, so they would be handled using d generic message
// we pass all the errors mongoose created into these error functions so we return a new error created with our AppError class

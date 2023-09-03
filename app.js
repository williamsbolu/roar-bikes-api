const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const itemRouter = require('./routes/itemRoutes');
const userRouter = require('./routes/userRoutes');
const cartRouter = require('./routes/cartRoutes');
const savedItemRouter = require('./routes/savedItemRoutes');

const app = express();

app.use(
    cors({
        origin: ['https://roarbike-stores.vercel.app'],
        credentials: true,
    })
);

app.options('*', cors());

app.use(express.static(path.join(__dirname, 'public')));

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use((req, res, next) => {
    // console.log('Hello from the middleware 😁');
    // console.log(req.headers); //get the req headers
    // console.log(req.cookies);
    next();
});

// body parser
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

app.use('/api/v1/items', itemRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/cart', cartRouter);
app.use('/api/v1/savedItem', savedItemRouter);

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Error Handling middleware: middleware only called when there is an error (accepts 4 parameters)
app.use(globalErrorHandler);

module.exports = app;

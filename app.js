const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const itemRouter = require('./routes/itemRoutes');
const userRouter = require('./routes/userRoutes');
const cartRouter = require('./routes/cartRoutes');
const savedItemRouter = require('./routes/savedItemRoutes');

const app = express();

app.enable('trust proxy'); // for d host platform

app.use(
    cors({
        origin: ['https://roarbike-stores.vercel.app', 'http://localhost:3001'],
        credentials: true,
    })
);

app.options('*', cors());

app.use(express.static(path.join(__dirname, 'public')));

// Set security HTTP headers
app.use(helmet());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Limit request from same APIs
const limiter = rateLimit({
    max: 150,
    windowMs: 60 * 60 * 1000,
    message: 'Too many request from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// Test middleware
app.use((req, res, next) => {
    // console.log('Hello from the middleware 😁');
    // console.log(req.headers); //get the req headers
    // console.log(req.cookies);
    next();
});

// body parser
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against xss
app.use(xss());

// Prevent parameter pollution
app.use(
    hpp({
        whitelist: ['price', 'type', 'stock', 'collections', 'name', 'createdAt'],
    })
);

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

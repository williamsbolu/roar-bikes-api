const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err.name, err.message);

    process.exit(1); // terminate/exit d serer
});

dotenv.config({
    path: './config.env',
});

const app = require('./app');

// Gets the database connection string and replace the password
const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD);

// connect method returns a promise
mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    })
    .then((con) => console.log('DB connection successful!'));
// .catch((err) => console.log('Error')); // for unhandled rejected promise

console.log(process.env.NODE_ENV);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`App running on port${port}...`);
});

// Handling Unhandled Rejections (promise) for (async) code
process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);

    // finishes all current and pending request and close
    server.close(() => {
        process.exit(1); // terminate/exit d serer
    });
});

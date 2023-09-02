const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Item = require('../../models/itemModel');
const User = require('../../models/userModel');

dotenv.config({
    path: './config.env',
});

// Gets the database connection string and replace the password
const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD);
console.log(DB);

// connect method returns a promise
mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
    })
    .then((con) => console.log('DB connection successful!'));
// .catch((err) => console.log('Error')); // for unhandled rejected promise

const items = JSON.parse(fs.readFileSync(`${__dirname}/product-simple.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));

// IMPORT DATA INTO DB
const importData = async () => {
    try {
        await Item.create(items);
        // await User.create(users);
        console.log('Data sucessfully loaded');
    } catch (err) {
        console.log('error in iporting');
        console.log(err);
    }
    process.exit(); // exits d node process in the command line
};

// DELETE ALL DATA FROM COLLECTION(DB)
const deleteData = async () => {
    try {
        await Item.deleteMany();
        // await User.deleteMany();
        console.log('Data sucessfully deleted');
    } catch (err) {
        console.log(err);
    }
    process.exit(); // exits d node process in the command line
};

if (process.argv[2] === '--import') {
    importData();
} else if (process.argv[2] === '--delete') {
    deleteData();
}

console.log(process.argv);

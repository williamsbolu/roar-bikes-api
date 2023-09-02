const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name'],
    },
    email: {
        type: String,
        required: [true, 'Please tell us your email'],
        lowercase: true,
        unique: true,
        validate: [validator.isEmail, 'Please provide a valid email'],
    },
    role: {
        type: String,
        enum: ['user', 'lead-asist', 'admin'],
        default: 'user',
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false, // permanently hides this field from the output
    },
    password: {
        type: String,
        minlength: 8,
        required: [true, 'Please provide a password'],
        select: false,
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            validator: function (el) {
                // "This" only works on CREATE and SAVE!!!
                // if passwordConfirm === password
                return el === this.password;
            },
            message: 'Passwords are not the same!',
        },
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false,
    },
});

userSchema.pre('save', async function (next) {
    // only run this middleware when the password has been modified (changed, created)
    if (!this.isModified('password')) return next();

    // Encrypt d password: hash with a cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    // Delete the password oonfirm field
    this.passwordConfirm = undefined;

    next();
});

userSchema.pre('save', function (next) {
    // If d password had not been modified or if d document is new run the middleware
    if (!this.isModified('password') || this.isNew) return next();

    // putting d passwordChangedAt one seconds in d past, makes sure d token is always created after d password has been changed
    this.passwordChangedAt = Date.now() - 1000;
    next();
});

// Instance Method:
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    // this.password: is not available due to d "select: false "field

    // returns "true" if d password are d same if not "false"
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

        // console.log(changedTimeStamp, JWTTimestamp);
        return JWTTimestamp < changedTimeStamp; // True means changed
    }

    // by default returns false means d user has not changed his password after d token was issued
    return false;
};

// Here we create a reset token, store the hashed reset token in d database, then send d reset token to d lient
userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    // By using "this" here in instance method, we did not save to the db, we "modify" the user document with the updated data
    // so later we "Save" the encrypted token "passwordResetToken" and "passwordResetExpires" to the db so we can compare with the token the user provides
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // console.log({ resetToken }, this.passwordResetToken);

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // current date + 10 minutes

    return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;

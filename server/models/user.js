const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        index: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    mobile: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'user',
    },
    cart: {
        type: Array,
        default: [],
    },
    //khoa phu den ban Address
    address: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'Address',
        }
    ],
    //khoa phu den bang Product
    wishlist: [{
        type: mongoose.Types.ObjectId,
        ref: 'Product',
    }],
    isBlocked: {
        type: Boolean,
        default: false,
    },
    refreshToken: {
        type: String,
    },
    //dung cho chuc nang quen mat khau
    passwordChangeAt: {
        type: String,
    },
    passwordResetToken: {
        type: String,
    },
    passwordResetExpired: {
        type: String,
    }
}, { timestamps: true });

//Export the model
module.exports = mongoose.model('User', userSchema);
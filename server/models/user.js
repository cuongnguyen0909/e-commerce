const mongoose = require('mongoose'); // Erase if already required
const bcrypt = require('bcrypt');
const crypto = require('crypto');
// Declare the Schema of the Mongo model
// add this inside your route
var userSchema = new mongoose.Schema(
    {
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
        avatar: {
            type: String,
        },
        mobile: {
            type: String,
            unique: true,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: [99, 2002],
            default: 99,
        },
        cart: [
            {
                product: { type: mongoose.Types.ObjectId, ref: 'Product' },
                quantity: Number,
                color: String,
                price: Number,
                thumb: String,
                title: String,
            },
        ],
        address: {
            type: String,
            default: '',
        },
        //khoa phu den bang Product
        wishlist: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'Product',
            },
        ],
        isBlocked: {
            type: Boolean,
            default: false,
        },
        refreshToken: {
            type: String,
        },
        //dung cho chuc nang quen mat khau
        passwordChangeAt: {
            type: Date,
        },
        passwordResetToken: {
            type: String,
        },
        passwordResetExpired: {
            type: Date,
        },
        // registerToken: {
        //     type: String,
        // }
    },
    { timestamps: true },
);

//trong model cua mongodb thi khong the dung arrow function
//vi this khong the su dung trong arrow function
//nhung api nao khong phai update ma luu lai gia tri nhu create, save
// thi se chay vao trong doan code nay
userSchema.pre('save', async function (next) {
    //neu password da hash roi thi khong hash nua
    //neu password khong thay doi thi se goi ham next() => dong vai tro nhu return
    //no se chay ham tiep theo ma khong thuc hien doan code ben duoi
    if (!this.isModified('password')) {
        next();
    }
    const salt = bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods = {
    isCorrectPassword: async function (password) {
        return await bcrypt.compare(password, this.password);
    },
    createdPasswordChangeToken: function () {
        const resetToken = crypto.randomBytes(32).toString('hex');
        this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        this.passwordResetExpired = Date.now() + 15 * 60 * 1000;
        return resetToken;
    },
};
//Export the model
module.exports = mongoose.model('User', userSchema);

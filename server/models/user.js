const mongoose = require('mongoose'); // Erase if already required
const bcrypt = require('bcrypt');
const crypto = require('crypto');
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
    cart: [{
        product: { type: mongoose.Types.ObjectId, ref: 'Product' },
        quantity: Number,
        color: String,
    }],
    //khoa phu den ban Address
    address: {
        type: Array,
        default: []
    },
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
})

userSchema.methods = {
    isCorrectPassword: async function (password) {
        return await bcrypt.compare(password, this.password);
    },
    createdPasswordChangeToken: function () {
        const resetToken = crypto.randomBytes(32).toString('hex');
        this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        this.passwordResetExpired = Date.now() + 15 * 60 * 1000;
        return resetToken;
    }

}
//Export the model
module.exports = mongoose.model('User', userSchema);
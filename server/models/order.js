const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var orderchema = new mongoose.Schema({
    products: [
        {
            product: { type: mongoose.Types.ObjectId, ref: 'Product' },
            quantity: Number,
            color: String,
            price: Number,
            thumb: String,
            title: String,
        }
    ],
    status: {
        type: String,
        default: 'Processing',
    },
    total: Number,
    orderBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
    paymentMethod: {
        type: String,
        default: 'COD',
    },
}, {
    timestamps: true,
});

//Export the model
module.exports = mongoose.model('Order', orderchema);

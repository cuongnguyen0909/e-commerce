const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true, //bo dau cach 2 dau
        },
        slug: {
            //may tinh apple -> may-tinh-apple
            type: String,
            required: true,
            lowercase: true,
        },
        description: {
            type: Array,
            required: true,
        },
        brand: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        varriants: [
            {
                title: String,
                color: String,
                price: Number,
                thumb: String,
                images: Array,
                sku: String,
                initialQuantity: Number,
                quantity: Number,
                sold: {
                    type: Number,
                    default: 0,
                }
            }
        ],
        initialQuantity: {
            type: Number,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        sold: {
            // so luong hang da ban
            type: Number,
            default: 0,
        },
        thumb: {
            type: String,
            required: true
        },
        images: {
            type: Array,
        },
        color: {
            type: String,
        },
        ratings: [
            {
                star: { type: Number },
                postedBy: { type: mongoose.Types.ObjectId, ref: 'User' },
                comment: { type: String },
                updatedAt: {
                    type: Date,
                }
            },
        ],
        totalRatings: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    },
);

//Export the model
module.exports = mongoose.model('Product', productSchema);

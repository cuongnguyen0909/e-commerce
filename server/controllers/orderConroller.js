const Order = require('../models/order')
const User = require('../models/user')
const Coupon = require('../models/coupon')


const asyncHandler = require('express-async-handler');

//CREATE NEW ORDER
const createOrder = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { coupon } = req.body;
    const userCart = await User.findById(_id).select('cart').populate('cart.product', 'title price');
    const products = userCart.cart.map((item) => {
        return {
            product: item.product._id,
            quantity: item.quantity,
            color: item.color
        }
    })
    let total = userCart.cart.reduce((totalCart, item) => item.product.price * item.quantity + totalCart, 0)
    const createdData = { products, total, orderBy: _id };

    if (coupon) {
        const selectedCoupon = await Coupon.findById(coupon);
        total = Math.round(total * (1 - selectedCoupon.discount / 100) / 1000) * 1000;
        createdData.total = total;
        createdData.coupon = coupon;
    }
    const result = await Order.create(createdData)
    return res.json({
        success: result ? true : false,
        result: result ? result : 'Something went wrong'
    })
})

//update status ORDER
const updateStatusOrder = asyncHandler(async (req, res) => {
    const { oid } = req.params;
    const { status } = req.body;
    if (!status) {
        throw new Error('Mising Status')
    }
    const response = await Order.findByIdAndUpdate(oid, { status }, { new: true })
    return res.json({
        success: response ? true : false,
        result: response ? response : 'Something went wrong'
    })
})

//get ORDER by user
const getOrderByUser = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const response = await Order.find({ orderBy: _id })
    return res.json({
        success: response ? true : false,
        result: response ? response : 'Something went wrong'
    })
})

//get ORDER by user
const getOrders = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const response = await Order.find()
    return res.json({
        success: response ? true : false,
        result: response ? response : 'Something went wrong'
    })
})
module.exports = {
    createOrder,
    updateStatusOrder,
    getOrderByUser,
    getOrders
}
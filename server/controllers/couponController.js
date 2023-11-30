const Coupon = require('../models/coupon')
const asyncHandler = require('express-async-handler');

//CREATE COUPON
const createCoupon = asyncHandler(async (req, res) => {
    const { name, discount, expired } = req.body;
    if (!name || !discount || !expired) {
        throw new Error('Missing Input')
    }
    const newCoupon = await Coupon.create({
        ...req.body,
        expired: Date.now() + +expired * 24 * 60 * 60 * 1000
    });
    return res.json({
        success: newCoupon ? true : false,
        createdCoupon: newCoupon ? newCoupon : 'Can not create new coupon'
    })
})
//GET COUPON
const getCoupons = asyncHandler(async (req, res) => {

    const coupons = await Coupon.find().select('-createdAt -updatedAt')
    return res.json({
        success: coupons ? true : false,
        coupons: coupons ? coupons : 'Can not get coupons'
    })
})
//UPDATE COUPON
const updateCoupon = asyncHandler(async (req, res) => {
    const { cid } = req.params;
    if (Object.keys(req.body).length === 0) {
        throw new Error('Missing Input')
    }
    if (req.body.expired) {
        req.body.expired = Date.now() + +req.body.expired * 24 * 60 * 60 * 1000;
    }
    const updatedCoupon = await Coupon.findByIdAndUpdate(cid, req.body, { new: true })
    return res.json({
        success: updatedCoupon ? true : false,
        updatedCoupon: updatedCoupon ? updatedCoupon : 'Can not update coupon'
    })
})
//DELETE COUPON
const deleteCoupon = asyncHandler(async (req, res) => {
    const { cid } = req.params;

    const deletedCoupon = await Coupon.findByIdAndDelete(cid)
    return res.json({
        success: deletedCoupon ? true : false,
        deletedCoupon: deletedCoupon ? deletedCoupon : 'Can not delete coupon'
    })
})
module.exports = {
    createCoupon,
    getCoupons,
    updateCoupon,
    deleteCoupon
}
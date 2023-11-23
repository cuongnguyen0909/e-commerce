const Brand = require('../models/brand')
const asyncHandler = require('express-async-handler');

//CREATE BLOG CATEGORY
const createBrand = asyncHandler(async (req, res) => {
    const newBrand = await Brand.create(req.body);
    return res.json({
        success: newBrand ? true : false,
        createdBrand: newBrand ? newBrand : 'Can not create new brand'
    })
})
//GET ALL BLOG CATEGORY
const getBrands = asyncHandler(async (req, res) => {
    const brands = await Brand.find();
    return res.json({
        success: brands ? true : false,
        brands: brands ? brands : 'Can not get all brand'
    })
})
//UPDATE BLOG CATEGORY
const updateBrand = asyncHandler(async (req, res) => {
    const { brid } = req.params;
    const updatedBrand = await Brand.findByIdAndUpdate(brid, req.body, { new: true })
    return res.json({
        success: updatedBrand ? true : false,
        updatedBrand: updatedBrand ? updatedBrand : 'Can not update brand'
    })
})
//DELETE BLOG CATEGORY
const deleteBrand = asyncHandler(async (req, res) => {
    const { brid } = req.params;
    const deletedBrand = await Brand.findByIdAndDelete(brid)
    return res.json({
        success: deletedBrand ? true : false,
        deletedBrand: deletedBrand ? deletedBrand : 'Can not delete brand'
    })
})
module.exports = {
    createBrand,
    getBrands,
    updateBrand,
    deleteBrand
}
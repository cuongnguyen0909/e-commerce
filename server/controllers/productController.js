const Product = require('../models/product')
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
//CREATE PRODUCT
const createProduct = asyncHandler(async (req, res) => {
    if (Object.keys(req.body).length === 0) {
        throw new Error('Missing Input');
    }
    if (req.body && req.body.title) {
        req.body.slug = slugify(req.body.title);
    }

    const newProduct = await Product.create(req.body);
    return res.status(200).json({
        success: newProduct ? true : false,
        createdProduct: newProduct ? newProduct : 'Can not create new product'
    })
})
//GET ONE PRODUCT
const getOneProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params; //api/product/:pid
    const product = await Product.findById(pid);
    return res.status(200).json({
        success: product ? true : false,
        createdProduct: product ? product : 'Can not get product'
    })
})
//GET PRODUCTs 
//filtering, sorting & pagination
const getAllProduct = asyncHandler(async (req, res) => {
    const products = await Product.find();
    return res.status(200).json({
        success: products ? true : false,
        createdProduct: products ? products : 'Can not get all products'
    })
})
//UPDATE PRODUCT
const updateProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params;
    if (req.body && req.body.title) {
        req.body.slug = slugify(req.body.title);
    }
    const updatedProduct = await Product.findByIdAndUpdate(pid, req.body, { new: true });
    return res.status(200).json({
        success: updatedProduct ? true : false,
        createdProduct: updatedProduct ? updatedProduct : 'Can not update product'
    })
})
//DELETE PRODUCT
const deleteProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(pid);
    return res.status(200).json({
        success: deletedProduct ? true : false,
        createdProduct: deletedProduct ? deletedProduct : 'Can not delete product'
    })
})

module.exports = {
    createProduct,
    getOneProduct,
    getAllProduct,
    updateProduct,
    deleteProduct
}
const ProductCategory = require('../models/produtCategory');
const asyncHandler = require('express-async-handler');
const data = require('../../data/cate_brand.json');
//CREATE PRODUCT CATEGORY
const createProductCategory = asyncHandler(async (req, res) => {
    if (Object.keys(req.body).length === 0) {
        throw new Error('Missing Input');
    }
    if (Object.keys(req.body).length === 0) {
        throw new Error('Missing Input');
    }
    const newProductCategory = await ProductCategory.create(req.body);
    return res.json({
        status: newProductCategory ? true : false,
        createdProductCategory: newProductCategory ? newProductCategory : 'Can not create new Product Category',
    });
});
//GET ALL PRODUCT CATEGORY
const getProductCategories = asyncHandler(async (req, res) => {
    const proCategories = await ProductCategory.find();
    return res.json({
        status: proCategories ? true : false,
        proCategories: proCategories ? proCategories : 'Can not get all product categories',
    });
});
//UPDATE PRODUCT CATEGORY
const updateProductCategory = asyncHandler(async (req, res) => {
    const { pcid } = req.params;
    const updatedProCategory = await ProductCategory.findByIdAndUpdate(pcid, req.body, { new: true });
    return res.json({
        status: updatedProCategory ? true : false,
        updatedProCategory: updatedProCategory ? updatedProCategory : 'Can not update product categories',
    });
});
//DELETE PRODUCT CATEGORY
const deleteProductCategory = asyncHandler(async (req, res) => {
    const { pcid } = req.params;
    const deletedProCategory = await ProductCategory.findByIdAndDelete(pcid);
    return res.json({
        status: deletedProCategory ? true : false,
        deletedProCategory: deletedProCategory ? deletedProCategory : 'Can not delete product categories',
    });
});
//FUNCTION INSERT DATA
const ultils = async (cate) => {
    await ProductCategory.create({
        title: cate?.cate,
        brand: cate?.brand,
        image: cate?.image,
    });
};
//INSERT DATA TO DATABASE
const insertData = asyncHandler(async (req, res) => {
    const promises = [];
    // console.log(typeof data);
    for (let cate of data) {
        promises.push(ultils(cate));
    }
    await Promise.all(promises);
    return res.json({
        status: true,
    });
});
module.exports = {
    createProductCategory,
    getProductCategories,
    updateProductCategory,
    deleteProductCategory,
    insertData,
};

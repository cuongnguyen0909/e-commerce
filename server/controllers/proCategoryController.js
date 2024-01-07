const ProductCategory = require('../models/produtCategory');
const asyncHandler = require('express-async-handler');
const data = require('../../data/cate_brand.json');
//CREATE PRODUCT CATEGORY
const createOrUpdateProductCategory = asyncHandler(async (req, res) => {
    const { title, brand } = req.body;
    if (!title) {
        throw new Error('Missing Input: Title is required');
    }

    try {
        const updatedCategory = await ProductCategory.findOneAndUpdate(
            { title, 'brand': { $ne: brand } }, // Chỉ thêm brand nếu nó chưa tồn tại trong mảng brand
            { $addToSet: { brand } }, // Thêm brand vào mảng brand
            { new: true, upsert: true } // Tạo mới nếu không tìm thấy category với title
        );

        return res.json({
            status: true,
            result: updatedCategory,
            message: 'Category created/updated successfully',
        });
    } catch (error) {
        console.error('Error:', error.message);
        return res.status(500).json({
            status: false,
            message: 'Internal Server Error',
        });
    }
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
    const { title, brand } = req.body;

    // Kiểm tra xem title và brand có được cung cấp không
    if (!title && !brand) {
        return res.status(400).json({
            status: false,
            message: 'Title or brand must be provided for update.',
        });
    }

    // Tạo object để chứa các trường cần cập nhật
    const updateFields = {};
    if (title) {
        updateFields.title = title;
    }
    if (brand) {
        updateFields.$set = { brand: brand };
    }

    // Thực hiện cập nhật dựa trên ID và chỉ cập nhật các trường được cung cấp
    const updatedProCategory = await ProductCategory.findByIdAndUpdate(pcid, updateFields, { new: true });

    return res.json({
        status: updatedProCategory ? true : false,
        updatedProCategory: updatedProCategory ? updatedProCategory : 'Cannot update product categories',
    });
});


// DELETE PRODUCT CATEGORY OR BRAND
// DELETE BRAND FROM CATEGORY
// DELETE CATEGORY OR BRAND
const deleteCategory = asyncHandler(async (req, res) => {
    const { title } = req.params;
    if (!title) {
        return res.status(400).json({
            status: false,
            message: 'Title must be provided for deletion.',
        });
    }

    const deletedCategory = await ProductCategory.findOneAndDelete({ title });

    return res.json({
        status: deletedCategory ? true : false,
        deletedCategory: deletedCategory ? deletedCategory : 'Can not delete the category',
    });
});


const deleteBrand = asyncHandler(async (req, res) => {
    const { title, brand } = req.params;

    if (!title || !brand) {
        return res.status(400).json({
            status: false,
            message: 'Title and brand must be provided for deletion.',
        });
    }
    const updatedCategory = await ProductCategory.findOneAndUpdate(
        { title },
        { $pull: { brand } },
        { new: true }
    );
    return res.json({
        status: updatedCategory ? true : false,
        updatedCategory: updatedCategory ? updatedCategory : 'Can not delete the brand',
    });
});


//FUNCTION INSERT DATA
const ultils = async (cate) => {
    await ProductCategory.create({
        title: cate?.cate,
        brand: cate?.brand
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
    getProductCategories,
    updateProductCategory,
    insertData,
    createOrUpdateProductCategory,
    deleteCategory,
    deleteBrand
};

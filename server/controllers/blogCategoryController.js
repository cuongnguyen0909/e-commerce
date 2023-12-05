const BlogCategory = require('../models/blogCategory');
const asyncHandler = require('express-async-handler');

//CREATE BLOG CATEGORY
const createBlogCategory = asyncHandler(async (req, res) => {
    const newBlogCategory = await BlogCategory.create(req.body);
    return res.json({
        status: newBlogCategory ? true : false,
        createdBlogCategory: newBlogCategory ? newBlogCategory : 'Can not create new Blog Category',
    });
});
//GET ALL BLOG CATEGORY
const getBlogCategories = asyncHandler(async (req, res) => {
    const blogCategories = await BlogCategory.find().select('title _id');
    return res.json({
        status: blogCategories ? true : false,
        blogCategories: blogCategories ? blogCategories : 'Can not get all blog categories',
    });
});
//UPDATE BLOG CATEGORY
const updateBlogCategory = asyncHandler(async (req, res) => {
    const { bcid } = req.params;
    const updatedBlogCategory = await BlogCategory.findByIdAndUpdate(bcid, req.body, { new: true });
    return res.json({
        status: updatedBlogCategory ? true : false,
        updatedBlogCategory: updatedBlogCategory ? updatedBlogCategory : 'Can not update blog categories',
    });
});
//DELETE BLOG CATEGORY
const deleteBlogCategory = asyncHandler(async (req, res) => {
    const { bcid } = req.params;
    const deletedBlogCategory = await BlogCategory.findByIdAndDelete(bcid);
    return res.json({
        status: deletedBlogCategory ? true : false,
        deletedBlogCategory: deletedBlogCategory ? deletedBlogCategory : 'Can not delete blog categories',
    });
});
module.exports = {
    createBlogCategory,
    getBlogCategories,
    updateBlogCategory,
    deleteBlogCategory,
};

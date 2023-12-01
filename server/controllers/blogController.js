const Blog = require('../models/blog');
const asyncHandler = require('express-async-handler');

//CREATE BLOG CATEGORY
const createNewBlog = asyncHandler(async (req, res) => {
    const { title, description, category } = req.body;
    if (!title || !description || !category) {
        throw new Error('Missing Input');
    }
    const newBlog = await Blog.create(req.body);
    return res.json({
        success: newBlog ? true : false,
        newBlog: newBlog ? newBlog : 'Can not create new Blog',
    });
});
//CREATE BLOG CATEGORY
const getAllBlog = asyncHandler(async (req, res) => {
    const blogs = await Blog.find().select('title description category numbeViews author likes');
    return res.json({
        success: blogs ? true : false,
        blogs: blogs ? blogs : 'Can not get blogs',
    });
});
//UPDATE BLOG
const updateBlog = asyncHandler(async (req, res) => {
    const { bid } = req.params;
    if (Object.keys(req.body).length === 0) {
        throw new Error('Missing Input');
    }
    const updatedBlog = await Blog.findByIdAndUpdate(bid, req.body, {
        new: true,
    });
    return res.json({
        success: updatedBlog ? true : false,
        updatedBlog: updatedBlog ? updatedBlog : 'Can not update blog',
    });
});
//DELETE BLOG
const deleteBlog = asyncHandler(async (req, res) => {
    const { bid } = req.params;
    const deletedBlog = await Blog.findByIdAndDelete(bid);
    return res.json({
        success: deletedBlog ? true : false,
        deletedBlog: deletedBlog ? deletedBlog : 'Can not update blog',
    });
});
/**
 * Khi nguoi dung like 1 blog
 * ->Check xem user do co dislike hay khong -> yes -> bo dislike
 *                                          -> no
 *                                          |
 *                                          V
 * ->Check xem nguoi do co like hay khong -> yes -> bo like
 *                                            -> No -> them like
 */
const likeBlog = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { bid } = req.params;
    if (!bid) throw new Error('Missing Input');
    const blog = await Blog.findById(bid);
    const alreadyDisliked = blog.disLikes.find((item) => item.toString() === _id);
    if (alreadyDisliked) {
        const response = await Blog.findByIdAndUpdate(
            bid,
            {
                $pull: { disLikes: _id },
            },
            { new: true },
        );
        return res.json({
            success: response ? true : false,
            result: response,
        });
    }
    const isLiked = blog.likes.find((item) => item.toString() === _id);
    if (isLiked) {
        const response = await Blog.findByIdAndUpdate(
            bid,
            {
                $pull: { likes: _id },
            },
            { new: true },
        );
        return res.json({
            success: response ? true : false,
            result: response,
        });
    } else {
        const response = await Blog.findByIdAndUpdate(bid, { $push: { likes: _id } }, { new: true });
        return res.json({
            success: response ? true : false,
            result: response,
        });
    }
});
const disLikeBlog = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { bid } = req.params;
    if (!bid) throw new Error('Missing Input');
    const blog = await Blog.findById(bid);
    const alreadyLiked = blog.likes.find((item) => item.toString() === _id);
    if (alreadyLiked) {
        const response = await Blog.findByIdAndUpdate(
            bid,
            {
                $pull: { likes: _id },
            },
            { new: true },
        );
        return res.json({
            success: response ? true : false,
            result: response,
        });
    }
    const isDisLiked = blog.disLikes.find((item) => item.toString() === _id);
    if (isDisLiked) {
        const response = await Blog.findByIdAndUpdate(
            bid,
            {
                $pull: { disLikes: _id },
            },
            { new: true },
        );
        return res.json({
            success: response ? true : false,
            result: response,
        });
    } else {
        const response = await Blog.findByIdAndUpdate(bid, { $push: { disLikes: _id } }, { new: true });
        return res.json({
            success: response ? true : false,
            result: response,
        });
    }
});
const getOneBlog = asyncHandler(async (req, res) => {
    const { bid } = req.params;
    const blog = await Blog.findByIdAndUpdate(bid, { $inc: { numberViews: 1 } }, { new: true })
        .populate('likes', 'firstName lastName')
        .populate('disLikes', 'firstName lastName');
    console.log(blog);
    // console.log(blog?.likes?.forEach(item => console.log(item._id)));
    return res.json({
        success: blog ? true : false,
        blog: blog ? blog : 'Can not get blog',
    });
});
const uploadImageBlog = asyncHandler(async (req, res) => {
    const { bid } = req.params;
    if (!req.file) throw new Error('Missing Input');
    const response = await Blog.findByIdAndUpdate(bid, { image: req.file.path }, { new: true });
    return res.json({
        success: response ? true : false,
        updatedBlog: response ? response : 'Can not upload images blog',
    });
});
module.exports = {
    createNewBlog,
    getAllBlog,
    updateBlog,
    deleteBlog,
    likeBlog,
    disLikeBlog,
    getOneBlog,
    uploadImageBlog,
};

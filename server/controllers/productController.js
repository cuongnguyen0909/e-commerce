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
        product: product ? product : 'Can not get product'
    })
})

//filtering, sorting & pagination
//https://jeffdevslife.com/p/1-mongodb-query-of-advanced-filtering-sorting-limit-field-and-pagination-with-mongoose/
//https://jeffdevslife.com/p/2-mongodb-query-of-advanced-filtering-sorting-limit-field-and-pagination-with-mongoose/
const getProducts = asyncHandler(async (req, res) => {
    // Lấy các tham số truy vấn từ request
    const query = { ...req.query };
    // console.log(query, typeof (req.query));
    // Tách các trường đặc biệt ra khỏi truy vấn
    /**Trong một ứng dụng web, khi người dùng gửi các yêu cầu tìm kiếm hoặc lọc dữ liệu, 
     * có thể có các tham số hoặc trường không phải là một phần của dữ liệu thực tế mà họ muốn truy vấn.
    Việc loại bỏ các trường không mong muốn giúp đảm bảo rằng chỉ những trường hợp thích hợp 
    và an toàn được sử dụng trong truy vấn. */
    const excludedFields = ['limit', 'sort', 'page', 'fields'];
    // Loại bỏ các trường đặc biệt khỏi truy vấn
    excludedFields.forEach(item => {
        delete query[item];
        // console.log(query);
    });
    //object->json->object hop le(thay the nhung cai toan tu nhu gte|gt thanh $gte|$gt)
    // Định dạng các toán tử để phù hợp với cú pháp của Mongoose
    let queryString = JSON.stringify(query);//object -> json
    console.log(queryString, typeof (queryString));
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, matchedElement => `$${matchedElement}`);
    // Chuyển đổi truy vấn đã định dạng thành đối tượng JSON
    const formattedQuery = JSON.parse(queryString);//json->object
    // console.log(formattedQuery, typeof (formattedQuery));
    // Filtering
    if (query?.title) {
        formattedQuery.title = { $regex: query.title, $options: 'i' }
    }
    // Tạo một lệnh truy vấn mà không thực hiện nó ngay lập tức
    let queryCommand = Product.find(formattedQuery);
    // Thực hiện truy vấn bằng cách sử dụng await

    //Sorting
    if (req.query.sort) {
        // console.log('req.query.sort', req.query.sort);
        const sortBy = req.query.sort.split(',').join(' ');
        // console.log('sortBy', sortBy);
        queryCommand = queryCommand.sort(sortBy);
    }

    //Filter limiting
    if (req.query.fields) {
        const fields = req.query.fields.split(',').join(' ');
        queryCommand = queryCommand.select(fields);
    }
    //pagination
    // page=2&limit=10, 1-10 page 1, 11-20 page 2, 21-30 page 3
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 2;
    const skip = (page - 1) * limit;
    queryCommand.skip(skip).limit(limit);
    const response = await queryCommand.exec();
    // Đếm số lượng tài liệu thỏa mãn truy vấn
    const total = await Product.countDocuments(formattedQuery);
    // Trả về kết quả của API
    return res.status(200).json({
        success: response ? true : false,
        total,
        results: response.length,
        products: response ? response : 'Can not get products'
    });
});

//UPDATE PRODUCT
const updateProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params;
    if (req.body && req.body.title) {
        req.body.slug = slugify(req.body.title);
    }
    const updatedProduct = await Product.findByIdAndUpdate(pid, req.body, { new: true });
    return res.status(200).json({
        success: updatedProduct ? true : false,
        updatedProduct: updatedProduct ? updatedProduct : 'Can not update product'
    })
})

//DELETE PRODUCT
const deleteProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(pid);
    return res.status(200).json({
        success: deletedProduct ? true : false,
        deletedProduct: deletedProduct ? deletedProduct : 'Can not delete product'
    })
})

//RATINGs PRODUCT
const ratingProduct = asyncHandler(async (req, res) => {
    const { _id } = req.user;

    const { star, comment, pid } = req.body;
    if (!star || !pid) {
        throw new Error('Missing input');
    }
    const ratingProduct = await Product.findById(pid);
    const alreadyRating = ratingProduct?.ratings?.find(item => item.postedBy.toString() === _id);
    // console.log({ alreadyRating });
    if (alreadyRating) {
        //update lai star va comment
        await Product.updateOne(
            { ratings: { $elemMatch: alreadyRating } },
            { $set: { "ratings.$.star": star, "ratings.$.comment": comment } },
            { new: true }
        )
    } else {
        //add new start and comment
        await Product.findByIdAndUpdate(
            pid,
            { $push: { ratings: { star, comment, postedBy: _id } } },
            { new: true }
        )
        // console.log({ response });
    }
    //sum ratings
    const updatedProduct = await Product.findById(pid);
    const ratingCount = updatedProduct.ratings.length;
    const sumRatings = updatedProduct.ratings.reduce((sum, item) => {
        return sum + +item.star;
    }, 0)
    updatedProduct.totalRatings = (sumRatings / ratingCount).toFixed(1);
    await updatedProduct.save();
    return res.status(200).json({
        success: true,
        updatedProduct
    })
})



module.exports = {
    createProduct,
    getOneProduct,
    getProducts,
    updateProduct,
    deleteProduct,
    ratingProduct
}
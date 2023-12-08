const Product = require('../models/product');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
const data = require('../../data/data.json');

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
        status: newProduct ? true : false,
        createdProduct: newProduct ? newProduct : 'Can not create new product',
    });
});

//GET ONE PRODUCT
const getOneProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params; //api/product/:pid
    const product = await Product.findById(pid).populate('ratings.postedBy', 'firstName lastName');
    console.log(product?.ratings?.postedBy);
    return res.status(200).json({
        status: product ? true : false,
        product: product ? product : 'Can not get product',
        rs: product?.ratings?.postedBy,
    });
});

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
    excludedFields.forEach((item) => {
        delete query[item];
        // console.log(query);
    });
    //object->json->object hop le(thay the nhung cai toan tu nhu gte|gt thanh $gte|$gt)
    // Định dạng các toán tử để phù hợp với cú pháp của Mongoose
    let queryString = JSON.stringify(query); //object -> json
    // console.log(queryString, typeof queryString);
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, (matchedElement) => `$${matchedElement}`);
    // Chuyển đổi truy vấn đã định dạng thành đối tượng JSON
    let formattedQueries = JSON.parse(queryString); //json->object
    let colorQueryObject = {};
    // console.log(formattedQueries, typeof (formattedQueries));

    // Filtering
    if (query?.title) {
        formattedQueries.title = { $regex: query.title, $options: 'i' };
    }
    if (query?.category) {
        formattedQueries.category = { $regex: query.category, $options: 'i' };
    }
    if (query?.color) {
        delete formattedQueries.color;
        const colorArray = query.color?.split(',');
        const colorQuery = colorArray.map(item => ({ color: { $regex: item, $options: 'i' } }));
        colorQueryObject = { $or: colorQuery };
    }
    const chainQuery = { ...colorQueryObject, ...formattedQueries };
    // console.log(chainQuery)
    // Tạo một lệnh truy vấn mà không thực hiện nó ngay lập tức
    let queryCommand = Product.find(chainQuery);
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
    const limit = +req.query.limit || 10;
    const skip = (page - 1) * limit;
    queryCommand.skip(skip).limit(limit);
    const response = await queryCommand.exec();
    // console.log(response);
    // Đếm số lượng tài liệu thỏa mãn truy vấn
    const total = await Product.countDocuments(chainQuery);
    // Trả về kết quả của API
    return res.status(200).json({
        status: response ? true : false,
        total,
        results: response.length,
        products: response ? response : 'Can not get products',
    });
});

//UPDATE PRODUCT
const updateProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params;
    if (req.body && req.body.title) {
        req.body.slug = slugify(req.body.title);
    }
    const updatedProduct = await Product.findByIdAndUpdate(pid, req.body, {
        new: true,
    });
    return res.status(200).json({
        status: updatedProduct ? true : false,
        updatedProduct: updatedProduct ? updatedProduct : 'Can not update product',
    });
});

//DELETE PRODUCT
const deleteProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(pid);
    return res.status(200).json({
        status: deletedProduct ? true : false,
        deletedProduct: deletedProduct ? deletedProduct : 'Can not delete product',
    });
});

//RATINGs PRODUCT
const ratingProduct = asyncHandler(async (req, res) => {
    const { _id } = req.user;

    const { star, comment, pid } = req.body;
    if (!star || !pid) {
        throw new Error('Missing input');
    }
    const ratingProduct = await Product.findById(pid);
    const alreadyRating = ratingProduct?.ratings?.find((item) => item.postedBy.toString() === _id);
    // console.log({ alreadyRating });
    if (alreadyRating) {
        //update lai star va comment
        await Product.updateOne(
            { ratings: { $elemMatch: alreadyRating } },
            { $set: { 'ratings.$.star': star, 'ratings.$.comment': comment } },
            { new: true },
        );
    } else {
        //add new start and comment
        await Product.findByIdAndUpdate(pid, { $push: { ratings: { star, comment, postedBy: _id } } }, { new: true });
        // console.log({ response });
    }
    //sum ratings
    const updatedProduct = await Product.findById(pid);
    const ratingCount = updatedProduct.ratings.length;
    const sumRatings = updatedProduct.ratings.reduce((sum, item) => {
        return sum + +item.star;
    }, 0);
    updatedProduct.totalRatings = (sumRatings / ratingCount).toFixed(1);
    await updatedProduct.save();
    return res.status(200).json({
        status: true,
        updatedProduct,
    });
});

//UPLOAD IMAGE PRODUCT
const uploadImageProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params;
    if (!req.files) throw new Error('Missing Input');
    const response = await Product.findByIdAndUpdate(
        pid,
        {
            //push cac phan tu vao images dung $each cua mongoose
            $push: { images: { $each: req.files.map((item) => item.path) } },
        },
        { new: true },
    );
    return res.json({
        status: response ? true : false,
        updatedProduct: response ? response : 'Can not upload images product',
    });
});

//FUNCTION INSERT DATA
//FUNCTION INSERT DATA
const ultils = async (product) => {
    let price = Math.round(Number(product?.price?.match(/\d/g).join('')) / 100);

    // Kiểm tra nếu category là laptop
    if (product?.category[1] === 'laptop') {
        // Đảm bảo giá lớn hơn 10.000.000
        price = Math.max(price, 10000000);
        // Đảm bảo giá không bé hơn 500.000
        price = Math.max(price, 500000);
    }

    // Tính toán số lượng 5 sao
    const totalRatings = Math.round(Math.random() * 5);
    const totalProducts = await Product.countDocuments(); // Đếm tổng số lượng sản phẩm trong cơ sở dữ liệu

    // Đảm bảo số lượng 5 sao nhiều hơn 60% tổng số lượng sản phẩm
    const fiveStarCount = Math.max(Math.round(totalProducts * 0.6), totalRatings);

    await Product.create({
        title: product?.name,
        slug: slugify(product?.name) + Math.round(Math.random() * 1000) + '',
        description: product?.description,
        brand: product?.brand,
        price: price,
        category: product?.category[1],
        quantity: Math.round(Math.random() * 1000),
        sold: Math.round(Math.random() * 100),
        images: product?.images,
        color: product?.variants?.find((item) => item.label === 'Color')?.variants[0],
        thumb: product?.thumb,
        totalRatings: fiveStarCount, // Sử dụng số lượng 5 sao tính toán
    });
};

//INSERT DATA TO DATABASE
const insertData = asyncHandler(async (req, res) => {
    const promises = [];
    // console.log(typeof data);
    for (let product of data) {
        promises.push(ultils(product));
    }
    await Promise.all(promises);
    return res.json({
        status: true,
    });
});
module.exports = {
    createProduct,
    getOneProduct,
    getProducts,
    updateProduct,
    deleteProduct,
    ratingProduct,
    uploadImageProduct,
    insertData,
};

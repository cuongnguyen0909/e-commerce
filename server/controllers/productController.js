const Product = require('../models/product');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
const data = require('../../data/data.json');
const makeSKU = require('uniqid');
//CREATE PRODUCT
const createProduct = asyncHandler(async (req, res) => {
    const { title, description, brand, category, color } = req.body;
    const quantity = +req.body.quantity;
    const price = +req.body.price;
    const thumb = req.files.thumb[0]?.path;
    const images = req.files?.images?.map((item) => item.path);
    if (thumb) {
        req.body.thumb = thumb;
    }
    if (images) {
        req.body.images = images;
    }
    if (!(title || description || brand || category || quantity || color || price || thumb || images)) {
        throw new Error('Missing Input');
    }
    req.body.slug = slugify(title);
    const newProduct = await Product.create({ ...req.body, initialQuantity: quantity });
    return res.status(200).json({
        status: newProduct ? true : false,
        createdProduct: newProduct ? newProduct : 'Can not create new product',
    });
});

//GET ONE PRODUCT
const getOneProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params; //api/product/:pid
    const product = await Product.findById(pid).populate('ratings.postedBy', 'firstName lastName avatar');
    // console.log(product?.ratings?.postedBy);
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
    if (query?.brand) {
        formattedQueries.brand = { $regex: query.brand, $options: 'i' };
    }
    if (query?.color) {
        delete formattedQueries.color;
        const colorArray = query.color?.split(',');
        const colorQuery = colorArray.map(item => ({ color: { $regex: item, $options: 'i' } }));
        colorQueryObject = { $or: colorQuery };
    }

    // if (query?.brand) {
    //     delete formattedQueries.brand;
    //     const brandArray = query.brand?.split(',');
    //     const brandQuery = brandArray.map(item => ({ brand: { $regex: item, $options: 'i' } }));
    //     brandQueryObject = { $or: brandQuery };
    // }

    // let queryObject = {};
    if (req.query.query) {
        delete formattedQueries.query;
        formattedQueries['$or'] = [
            { title: { $regex: query.query, $options: 'i' } },
            // { brand: { $regex: query.query, $options: 'i' } },
            { category: { $regex: query.query, $options: 'i' } },
        ]
    }
    // queryObject = {
    //     $or: [
    //         { title: { $regex: query.query, $options: 'i' } },
    //         { brand: { $regex: query.query, $options: 'i' } },
    //         { category: { $regex: query.query, $options: 'i' } },
    //     ]
    // }

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
    const files = req?.files;
    if (files?.thumb) {
        req.body.thumb = files?.thumb[0]?.path;
    }
    if (files?.images) {
        req.body.images = files?.images?.map(item => item.path)
    }
    if (req.body && req.body.title) {
        req.body.slug = slugify(req.body.title);
    }
    const updatedProduct = await Product.findByIdAndUpdate(pid,
        {
            ...req.body, initialQuantity: req.body.quantity
        }
        , {
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
        message: deletedProduct ? 'Delete product successfully!' : 'Delete product fail!!',
    });
});

const addVarriant = asyncHandler(async (req, res) => {
    const { pid } = req.params;
    const { title, color, price, quantity } = req.body;
    const thumb = req.files.thumb[0]?.path;
    const images = req.files?.images?.map((item) => item.path);
    if (thumb) {
        req.body.thumb = thumb;
    }
    if (images) {
        req.body.images = images;
    }
    if (!(title || color || price || quantity || thumb || images)) {
        throw new Error('Missing Input');
    }
    const product = Product.findById(pid);
    if (product.color === color) {
        throw new Error('Color already exists');
    }
    req.body.slug = slugify(title);
    const response = await Product.findByIdAndUpdate(
        pid,
        {
            $push: { varriants: { color, price, title, thumb, images, quantity, initialQuantity: quantity, sku: makeSKU().toUpperCase() } },
        },
        { new: true },
    );
    return res.status(200).json({
        status: response ? true : false,
        message: response ? 'Add varriant successfully' : 'Add varriant fail',
    });
})

const deleteVarriant = asyncHandler(async (req, res) => {
    const { pid, sku } = req.params;
    const varriants = await Product.findById(pid).select('varriants');
    console.log(varriants)
    const alredyVarriant = varriants?.varriants?.find((item) => item?.sku === sku);

    if (!alredyVarriant) {
        throw new Error('Varriant not found');
    }

    const response = await Product.findByIdAndUpdate(
        pid,
        {
            $pull: { varriants: { sku } },
        },
        { new: true },
    );
    return res.status(200).json({
        status: response ? true : false,
        message: response ? 'Delete varriant successfully' : 'Delete varriant fail',
    });
})

const updateVarriant = asyncHandler(async (req, res) => {
    const { pid } = req.params;
    const { title, color, price, quantity } = req.body;
    const thumb = req.files.thumb[0]?.path;
    const images = req.files?.images?.map((item) => item.path);
    if (thumb) {
        req.body.thumb = thumb;
    }
    if (images) {
        req.body.images = images;
    }
    if (!(title || color || price || quantity || thumb || images)) {
        throw new Error('Missing Input');
    }
    req.body.slug = slugify(title);
    const varriants = await Product.findById(pid).select('varriants');
    const alredyVarriant = varriants?.find((item) => item?.color === color && item?.title === title);
    if (alredyVarriant) {
        const response = await Product.updateOne(
            {
                varriants: { $elemMatch: alredyVarriant },
            },
            {
                $set: {
                    'varriants.$.color': color,
                    'varriants.$.price': price,
                    'varriants.$.title': title,
                    'varriants.$.thumb': thumb,
                    'varriants.$.images': images,
                    'varriants.$.quantity': quantity,
                },
            },
            { new: true },
        )
        return res.status(200).json({
            status: response ? true : false,
            message: response ? 'Update varriant successfully' : 'Update varriant fail',
        });
    } else {
        const response = await Product.findByIdAndUpdate(
            pid,
            {
                $push: { varriants: { color, price, title, thumb, images, quantity, sku: makeSKU().toUpperCase() } },
            },
            { new: true },
        )
        return res.status(200).json({
            status: response ? true : false,
            message: response ? 'Add varriant successfully' : 'Add varriant fail',
        });
    }
})

//RATINGs PRODUCT
const ratingProduct = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { star, comment, pid, updatedAt } = req.body;
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
            { $set: { 'ratings.$.star': star, 'ratings.$.comment': comment, 'ratings.$.updatedAt': updatedAt } },
            { new: true },
        );
    } else {
        //add new start and comment
        await Product.findByIdAndUpdate(pid, { $push: { ratings: { star, comment, postedBy: _id, updatedAt } } }, { new: true });
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
const utils = async (product) => {
    // Kiểm tra xem danh mục của sản phẩm có trong danh sách ['Laptop', 'Smartphone', 'Tablet'] không
    const validCategories = ['Laptop', 'Smartphone', 'Tablet'];
    if (!product?.category || !product.category.some(cat => validCategories.includes(cat))) {
        // Nếu không thuộc danh mục mong muốn, không thêm sản phẩm
        return;
    }

    // Tạo số lượng random trong khoảng từ 1 đến 100
    let stock = Math.round(Math.random() * 100);
    // Tạo giá random trong khoảng từ 9000000 đến 40000000
    let price = Math.round(Math.random() * (40000000 - 9000000) + 9000000);

    // Thêm sản phẩm nếu thoả mãn điều kiện
    await Product.create({
        title: product?.name,
        slug: slugify(product?.name) + Math.round(Math.random() * 1000) + '',
        description: product?.description,
        brand: product?.brand,
        price: price,
        category: product?.category[1],
        initialQuantity: stock,
        quantity: stock,
        sold: Math.round(Math.random() * 100),
        images: product?.images,
        color: product?.variants?.find((item) => item.label === 'Color')?.variants[0] || 'BLACK',
        thumb: product?.thumb,
        totalRatings: 0,
    });
};



//INSERT DATA TO DATABASE
const insertData = asyncHandler(async (req, res) => {
    const promises = [];
    // console.log(typeof data);
    for (let product of data) {
        promises.push(utils(product));
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
    addVarriant,
    deleteVarriant,
    updateVarriant
};

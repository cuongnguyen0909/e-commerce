const Order = require('../models/order');
const User = require('../models/user');

const asyncHandler = require('express-async-handler');

//CREATE NEW ORDER
const createOrder = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { products, total, address, paymentMethod, status } = req.body;
    if (address) {
        await User.findByIdAndUpdate(_id, { address, cart: [] }, { new: true });
    }
    const response = await Order.create({ products, total, orderBy: _id, paymentMethod, status })
    return res.json({
        status: response ? true : false,
        message: response ? response : 'Something went wrong',
    });
});

//update status ORDER
const updateStatusOrder = asyncHandler(async (req, res) => {
    const { oid } = req.params;
    const { status } = req.body;
    // console.log(req.body)
    // console.log(status)
    if (!status) {
        throw new Error('Mising Status');
    }
    const response = await Order.findByIdAndUpdate(oid, { status }, { new: true });
    return res.json({
        status: response ? true : false,
        result: response ? response : 'Something went wrong',
    });
});

//get ORDER by user

const getOrderByUser = asyncHandler(async (req, res) => {
    const queries = { ...req.query };
    const { _id } = req.user;
    const excludedFields = ['limit', 'sort', 'page', 'fields'];
    excludedFields.forEach((item) => delete queries[item]);

    let queryString = JSON.stringify(queries); //object -> json
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, (matchedElement) => `$${matchedElement}`);

    const formattedQueries = JSON.parse(queryString); //json->object
    // let colorQueryObject = {};

    // Filtering
    // if (query?.title) {
    //     formattedQueries.title = { $regex: query.title, $options: 'i' };
    // }
    // if (query?.category) {
    //     formattedQueries.category = { $regex: query.category, $options: 'i' };
    // }
    // if (query?.brand) {
    //     formattedQueries.brand = { $regex: query.brand, $options: 'i' };
    // }
    // if (query?.color) {
    //     delete formattedQueries.color;
    //     const colorArray = query.color?.split(',');
    //     const colorQuery = colorArray.map(item => ({ color: { $regex: item, $options: 'i' } }));
    //     colorQueryObject = { $or: colorQuery };
    // }

    // let queryObject = {};
    // if (queries.q) {
    //     delete formattedQueries.q;
    //     // formattedQueries['$or'] = [
    //     //     { title: { $regex: query.query, $options: 'i' } },
    //     //     // { brand: { $regex: query.query, $options: 'i' } },
    //     //     { category: { $regex: query.query, $options: 'i' } },
    //     // ]
    //     queryObject = {
    //         $or: [

    //         ]
    //     }
    // }


    const qr = { ...formattedQueries, orderBy: _id };
    let queryCommand = Order.find(qr);
    queryCommand = queryCommand.populate('orderBy', 'firstName lastName email mobile address');

    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
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

    // Đếm số lượng tài liệu thỏa mãn truy vấn
    const total = await Order.countDocuments();
    // Trả về kết quả của API
    return res.status(200).json({
        status: response ? true : false,
        total,
        results: response.length,
        orders: response ? response : 'Can not get order',
    });
});

//get ORDER by admin
const getOrders = asyncHandler(async (req, res) => {
    const queries = { ...req.query };

    const excludedFields = ['limit', 'sort', 'page', 'fields'];
    excludedFields.forEach((item) => { delete queries[item]; });
    let queryString = JSON.stringify(queries); //object -> json
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, (matchedElement) => `$${matchedElement}`);
    const formattedQueries = JSON.parse(queryString); //json->object
    // let colorQueryObject = {};

    // Filtering
    // if (query?.title) {
    //     formattedQueries.title = { $regex: query.title, $options: 'i' };
    // }
    // if (query?.category) {
    //     formattedQueries.category = { $regex: query.category, $options: 'i' };
    // }
    // if (query?.brand) {
    //     formattedQueries.brand = { $regex: query.brand, $options: 'i' };
    // }
    // if (query?.color) {
    //     delete formattedQueries.color;
    //     const colorArray = query.color?.split(',');
    //     const colorQuery = colorArray.map(item => ({ color: { $regex: item, $options: 'i' } }));
    //     colorQueryObject = { $or: colorQuery };
    // }

    // let queryObject = {};
    // if (queries.q) {
    //     delete formattedQueries.q;
    //     // formattedQueries['$or'] = [
    //     //     { title: { $regex: query.query, $options: 'i' } },
    //     //     // { brand: { $regex: query.query, $options: 'i' } },
    //     //     { category: { $regex: query.query, $options: 'i' } },
    //     // ]
    //     queryObject = {
    //         $or: [

    //         ]
    //     }
    // }


    const qr = { ...formattedQueries };
    let queryCommand = Order.find(qr).populate('orderBy', 'firstName lastName email mobile address');;

    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
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
    const total = await Order.countDocuments();
    // Trả về kết quả của API
    return res.status(200).json({
        status: response ? true : false,
        total,
        results: response.length,
        orders: response ? response : 'Can not get orders',
    });
});

module.exports = {
    createOrder,
    updateStatusOrder,
    getOrderByUser,
    getOrders,
};

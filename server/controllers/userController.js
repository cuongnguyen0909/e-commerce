const User = require('../models/user');
const asyncHandler = require('express-async-handler');
const { generateAccessToken, generateRefreshToken } = require('../middlewares/jwt');
const jwt = require('jsonwebtoken');
const sendMail = require('../utils/sendMail');
const crypto = require('crypto');
const makeToken = require('uniqid');
const Product = require('../models/product');
const mongoose = require('mongoose');

const registerUser = asyncHandler(async (req, res) => {
    const { email, password, firstName, lastName, mobile } = req.body;
    if (!email || !password || !firstName || !lastName || !mobile) {
        return res.status(400).json({
            status: false,
            message: 'Missing input.',
        });
    }
    const user = await User.findOne({ email }); //{email: email}
    if (user) throw new Error(`Email ${user.email} already existed!`);
    else {
        const token = makeToken();
        const editedEmail = btoa(email) + '@' + token;
        const newUser = await User.create({
            email: editedEmail,
            password,
            firstName,
            lastName,
            mobile,
        })
        if (newUser) {
            const html = `<h2>Register Code: </h2><br/><blockquote>${token}</blockquote>`;
            await sendMail({ email, html, subject: 'Confirm register account in C-electronic' });
        }
        setTimeout(async () => {
            await User.deleteOne({ email: editedEmail });
        }, [5 * 60 * 1000]);
        return res.json({
            status: newUser ? true : false,
            message: newUser ? 'Please check your email to complete registration.' : 'Something went wrong. Please check again.',
        })
    }
});

//define final register after confirm email with token
const finalRegister = asyncHandler(async (req, res) => {
    const { token } = req.params;
    //compare token with email
    const notActiveEmail = await User.findOne({ email: { $regex: new RegExp(`${token}$`) } });
    if (notActiveEmail) {
        notActiveEmail.email = atob(notActiveEmail?.email?.split('@')[0]);
        notActiveEmail.save();
    }
    return res.json({
        status: notActiveEmail ? true : false,
        response: notActiveEmail ? 'Register successfully. Please Login' : 'Something went wrong. Please check again.',
    })

})
//refreshToken dung de cap  moi 1 cai accessToken
//accessToken dung de xac thuc nguoi dung, phan quyen nguoi dung

//api to change paasword
const changePassword = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { password, newPassword, reNewPassword } = req.body;
    console.log(password, newPassword, reNewPassword)
    if (!password) {
        return res.status(400).json({
            status: false,
            message: 'Password is required',
        });
    }
    if (!newPassword) {
        return res.status(400).json({
            status: false,
            message: 'New password is required',
        });
    }
    if (!reNewPassword) {
        return res.status(400).json({
            status: false,
            message: 'Confirm new password is required',
        });
    }

    const user = await User.findOne({ _id });
    // console.log(user)
    if (!user) {
        return res.status(400).json({
            status: false,
            message: 'User not found',
        });
    }

    if (!await user.isCorrectPassword(password)) {
        return res.status(400).json({
            status: false,
            message: 'Password not matched',
        });
    }

    if (newPassword !== reNewPassword) {
        return res.status(400).json({
            status: false,
            message: 'Password not matched',
        });
    }

    if (password === newPassword) {
        return res.status(400).json({
            status: false,
            message: 'New password must be different from old password',
        });
    }
    user.password = newPassword;
    await user.save()
    return res.status(200).json({
        status: user ? true : false,
        message: user ? 'Change password successfully' : 'Something went wrong. Please check again.',
    });
})

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            status: false,
            message: 'Email/ Password are required fields. Please enter in full',
        });
    }
    //repsonse se la mot instance cua mongo chu khong phai la mot object thuan(plain object)
    const user = await User.findOne({ email });
    // console.log(response.isCorrectPassword(password));//Promise { <pending> }
    if (user && (await user.isCorrectPassword(password))) {
        // console.log(user.isCorrectPassword(password));
        //su dung destructoring de remove passord va role khoi nguoi dung
        const { password, role, refreshToken, ...userData } = user.toObject();
        //tao accessToken va refeshToken
        const accessToken = generateAccessToken(user._id, role);
        const newRefreshToken = generateRefreshToken(user._id);
        //lu refresh token vao database
        await User.findByIdAndUpdate(user._id, { newRefreshToken }, { new: true });
        //luu refrehToken vao cookie
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return res.status(200).json({
            status: true,
            accessToken,
            userData,
        });
    } else {
        throw new Error('User not found or password not matched');
    }
});

//GET A USER
const getCurrentUser = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const user = await User.findOne({ _id }).select('-password')
        .populate({
            path: 'cart',
            populate: ({
                path: 'product',
                select: 'title thumb price quantity'
            })
        })
        .populate('wishlist', 'title thumb price color')

    return res.status(200).json({
        status: user ? true : false,
        user: user ? user : 'User not found',
    });
});

//DELETE A USER
const deleteUser = asyncHandler(async (req, res) => {
    const { uid } = req.params; //
    const response = await User.findByIdAndDelete(uid); //ham nay no van tra ve data user da xoa
    return res.status(200).json({
        status: response ? true : false,
        deletedUser: response ? `User with email: ${response.email} deleted` : 'No user delete',
    });
});
//UPDATE USER
const updateUser = asyncHandler(async (req, res) => {
    // console.log(req.file)
    const { _id } = req.user;
    const { firstName, lastName, email, mobile, address } = req.body;
    if (req.file) {
        req.body.avatar = req.file.path;
    }
    // khong cho nguoi dung tu sua role
    if (!_id || Object.keys(req.body).length === 0) throw new Error('Missing Input');
    const response = await User.findByIdAndUpdate(_id,
        {
            firstName, lastName, email, mobile, avatar: req.body.avatar, address
        }, { new: true, }).select('-refreshToken -password -role');
    return res.status(200).json({
        status: response ? true : false,
        message: response ? 'Updated information successfully' : 'Can not update profile!',
    });
});
//UPDATE USER BY ADMIN
const updateUserByAdmin = asyncHandler(async (req, res) => {
    const { uid } = req.params; // 'api/user/:uid' <=> 'api/user/:123456789'
    if (Object.keys(req.body).length === 0) throw new Error('Missing Input');
    const response = await User.findByIdAndUpdate(uid, req.body, {
        new: true,
    }).select('-refreshToken -password -role'); //ham nay no van tra ve data user da xoa
    return res.status(200).json({
        status: response ? true : false,
        updatedUser: response ? 'Updated' : 'Can not update user!',
    });
});
//GET ALL USER
const getAllUser = asyncHandler(async (req, res) => {
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

    // Filtering
    if (query?.firstName) {
        formattedQueries.firstName = { $regex: query.firstName, $options: 'i' };
    }
    if (query?.lastName) {
        formattedQueries.lastName = { $regex: query.lastName, $options: 'i' };
    }
    // const queries = {}
    // if (req.query.query) {
    //     query = {
    //         $or: [
    //             { firstName: { $regex: req.query.query, $options: 'i' } },
    //             { lastName: { $regex: req.query.query, $options: 'i' } },
    //             { email: { $regex: req.query.query, $options: 'i' } },
    //         ]
    //     }
    // }
    if (req.query.query) {
        delete formattedQueries.query;
        formattedQueries['$or'] = [
            { firstName: { $regex: req.query.query, $options: 'i' } },
            { lastName: { $regex: req.query.query, $options: 'i' } },
            { email: { $regex: req.query.query, $options: 'i' } },
            //role is a enum [99,2002]: 99 is user role, 2002 is admin role
            { role: { $regex: req.query.query, $options: 'i' } },


        ]
    }
    // Tạo một lệnh truy vấn mà không thực hiện nó ngay lập tức
    let queryCommand = User.find(formattedQueries);
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
    const total = await User.countDocuments(formattedQueries);
    // Trả về kết quả của API
    return res.status(200).json({
        status: response ? true : false,
        total,
        results: response.length,
        users: response ? response : 'Can not get products',
    });
});
const refreshAccessToken = asyncHandler(async (req, res) => {
    //lay token tu cookie
    const cookie = req.cookies;
    // check xem co token hay khong
    if (!cookie && !cookie['refreshToken']) {
        throw new Error('No refresh token in Cookie');
    }
    const result = await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET);
    console.log(result);
    const user = await User.findOne({
        _id: result._id,
        refreshToken: cookie.refreshToken,
    });
    return res.status(200).json({
        status: user ? true : false,
        newAccessToken: user ? generateAccessToken(user._id, user.role) : 'Refresh Token not matched',
    });
});

const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie && !cookie.refreshToken) {
        throw new Error('No fresh token in cookies');
    }
    //xoa refreh token trong database
    await User.findOneAndUpdate({ refreshToken: cookie.refreshToken }, { refreshToken: '' }, { new: true });
    //xoa refresh token trong trinh duyet
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
    });
    return res.status(200).json({
        status: true,
        message: 'Logout statusfully',
    });
});

// Client gui email
// Server check email co hop le hay khong
// Gui mail + kem theo link  + kem theo link (link nay se gom password change token)
// Client check mail => click link vao link server gui ve
// Client gui api len server kem theo token
// Check token co giong voi token ma server gui mail hay khong
// Change password if valid
// CREATE (POST) + PUT - gui tu body
// Get + delete = gui theo query (?xxx&xxxx)
const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) {
        throw new Error('Missing Email');
    }
    const user = await User.findOne({ email });
    if (!user) {
        //neu email khong hop le hoac khong co
        throw new Error('User not found!');
    }

    //dung medthod reset token trong model
    const resetToken = user.createdPasswordChangeToken();
    await user.save();

    const html = `Please click the link below to change your password.This link will expire after 15 minutes. 
    <a href=${process.env.CLIENT_URL}/resetpassword/${resetToken}> Click here</a> `;

    const data = {
        email,
        html,
        subject: 'Forgot password'
    };
    const result = await sendMail(data);
    return res.status(200).json({
        status: result.response.includes?.('OK') ? true : false,
        message: result.response.includes?.('OK') ? 'Please check your email to reset password.' : 'Mail may be wrong. Please check again.'
    });
});

const resetPassword = asyncHandler(async (req, res) => {
    const { password, token } = req.body;
    if (!password || !token) {
        throw new Error('Missing input');
    }
    //tim user co passwordResetToken = token va passwordResetExpired > Date.now()
    const passwordResetToken = await crypto.createHash('sha256').update(token).digest('hex');
    // find one user in database have passwordResetToken = token and passwordResetExpired > Date.now()
    const user = await User.findOne({
        passwordResetToken,
        passwordResetExpired: { $gt: Date.now() },
    });
    if (!user) {
        throw new Error('Invalid reset token');
    }
    //if user exist => update password
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordChangeAt = Date.now();
    user.passwordResetExpired = undefined;

    //then save user
    await user.save();
    return res.status(200).json({
        status: user ? true : false,
        message: user ? 'Updated password successfully' : 'Something went wrong!',
    });
});

//update address
const updateAddress = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    if (!req.body.address) throw new Error('Missing input');
    const response = await User.findByIdAndUpdate(
        _id,
        {
            $push: { address: req.body.address },
        },
        { new: true },
    ).select('-refreshToken -password -role');
    return res.json({
        status: response ? true : false,
        updatedUser: response ? response : 'Can not update new address',
    });
});


const updateCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { pid, quantity, color, price, thumb, title } = req.body;
    if (!pid || !color) throw new Error('Missing input');
    const userCart = await User.findById(_id).select('cart');
    // const varriants = await Product.findById(pid).select('varriants');
    let isChange = false;
    // console.log(userCart)
    const alreadyProduct = userCart?.cart?.find((item) => item?.product.toString() === pid && item?.color.toLowerCase() === color.toLowerCase());
    const product = await Product.findById(pid);
    // console.log(varriants)
    product?.varriants?.forEach(async (item) => {
        if (item.color.toLowerCase() === color.toLowerCase()) {
            item.sold = quantity;
            item.quantity = item.initialQuantity - item.sold;
        } else {
            product.sold = quantity;
            product.quantity = product.initialQuantity - product.sold;
        }
    })
    await product.save();

    if (!alreadyProduct) {
        const response = await User.findByIdAndUpdate(
            _id,
            {
                $push: { cart: { product: pid, quantity, color, price, thumb, title } },
            },
            { new: true },
        );
        return res.json({
            status: response ? true : false,
            message: response ? 'Updated your cart successfully' : 'Can not update cart',
        });
    } else {
        product.sold = quantity;
        product.quantity = product.initialQuantity - product.sold;
        await product.save();
        const response = await User.updateOne(
            {
                cart: { $elemMatch: alreadyProduct },
            },
            {
                $set: {
                    'cart.$.quantity': quantity,
                    'cart.$.price': price,
                    'cart.$.thumb': thumb,
                    'cart.$.title': title,
                }
            },
            { new: true, },
        );
        return res.json({
            status: response ? true : false,
            message: response ? 'Updated your cart successfully' : 'Can not update cart',
        });
    }

});

const removeProductInCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { pid, color } = req.params;
    const userCart = await User.findById(_id).select('cart');
    const product = await Product.findById(pid);

    const alreadyProduct = userCart?.cart?.find((item) => item?.product.toString() === pid && item?.color === color);
    if (!alreadyProduct) {
        return res.json({
            status: false,
            message: 'Product not found in cart',
        });
    }

    product.varriants.map(async (item) => {
        if (item.color.toLowerCase() === color.toLowerCase()) {
            item.sold = item.sold - Number(userCart?.cart?.find((itemCart) => itemCart?.color.toLowerCase() === item?.color.toLowerCase())?.quantity);
            item.quantity = item?.initialQuantity - item?.sold;
        } else {
            product.sold = product?.sold - Number(userCart?.cart?.find((itemCart) => itemCart?.color.toLowerCase() !== item?.color.toLowerCase())?.quantity);
            product.quantity = product?.initialQuantity - product?.sold;
        }
    })
    await product.save();

    const response = await User.findByIdAndUpdate(
        _id,
        {
            $pull: { cart: { product: pid, color } },
        },
        { new: true },
    );
    return res.json({
        status: response ? true : false,
        message: response ? 'Updated your cart successfully' : 'Can not update cart',
    });

});
const updateWishlist = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { pid } = req.params;
    const user = await User.findById(_id).populate(('wishlist', 'title thumb price color'));
    const alreadyProduct = user.wishlist?.find((item) => item.toString() === pid);
    if (alreadyProduct) {
        const response = await User.findByIdAndUpdate(
            _id,
            { $pull: { wishlist: pid } },
            { new: true }
        )
        return res.json({
            status: response ? true : false,
            message: response ? 'Updated your wishlist successfully' : 'Can not update wishlist',
        });
    } else {
        const response = await User.findByIdAndUpdate(
            _id,
            { $push: { wishlist: pid } },
            { new: true }
        )
        return res.json({
            status: response ? true : false,
            message: response ? 'Updated your wishlist successfully' : 'Can not update wishlist',
        });
    }
});

module.exports = {
    registerUser,
    login,
    getCurrentUser,
    getAllUser,
    refreshAccessToken,
    logout,
    forgotPassword,
    resetPassword,
    deleteUser,
    updateUser,
    updateUserByAdmin,
    updateAddress,
    updateCart,
    finalRegister,
    removeProductInCart,
    updateWishlist,
    changePassword
};

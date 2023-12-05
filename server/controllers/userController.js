const User = require('../models/user');
const asyncHandler = require('express-async-handler');
const { generateAccessToken, generateRefreshToken } = require('../middlewares/jwt');
const jwt = require('jsonwebtoken');
const sendMail = require('../ultils/sendMail');
const crypto = require('crypto');
const makeToken = require('uniqid');
// const user = require('../models/user');
//api register
//asyncHandler co cong dung hung nhung cai error va next toi thang tiep theo
// const registerUser = asyncHandler(async (req, res) => {
//     const { email, password, firstName, lastName } = req.body;
//     if (!email || !password || !firstName || !lastName) {
//         return res.status(400).json({
//             status: false,
//             message: 'Missing input.',
//         });
//     }
//     const user = await User.findOne({ email }); //{email: email}
//     if (user) throw new Error(`Email ${user.email} already existed!`);
//     else {
//         const newUser = await User.create(req.body);
//         return res.status(200).json({
//             status: newUser ? true : false,
//             message: newUser
//                 ? `Create ${newUser.email} statusfully. Please login`
//                 : 'Something went wrong. Please check again.',
//         });
//     }
// });
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
    const user = await User.findOne({ _id }).select('-refreshToken -password -role');
    return res.status(200).json({
        status: user ? true : false,
        user: user ? user : 'User not found',
    });
});

//DELETE A USER
const deleteUser = asyncHandler(async (req, res) => {
    const { _id } = req.query; //
    if (!_id) throw new Error('Missing Input');
    const response = await User.findByIdAndDelete({ _id }); //ham nay no van tra ve data user da xoa
    return res.status(200).json({
        status: response ? true : false,
        deletedUser: response ? `User with email: ${response.email} deleted` : 'No user delete',
    });
});
//UPDATE USER
const updateUser = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    // khong cho nguoi dung tu sua role
    const { password, role, refreshToken, ...userData } = req.body;
    if (!_id || Object.keys(userData).length === 0) throw new Error('Missing Input');
    const response = await User.findByIdAndUpdate(_id, userData, {
        new: true,
    }).select('-refreshToken -password -role'); //ham nay no van tra ve data user da xoa
    return res.status(200).json({
        status: response ? true : false,
        updatedUser: response ? response : 'Can not update user!',
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
        updatedUser: response ? response : 'Can not update user!',
    });
});
//GET ALL USER
const getAllUser = asyncHandler(async (req, res) => {
    const users = await User.find().select('-refreshToken -password -role');
    return res.status(200).json({
        status: users ? true : false,
        users,
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
        message: user ? 'Updated password statusfully' : 'Something went wrong!',
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
    const { pid, quantity, color } = req.body;
    if (!pid || !quantity || !color) throw new Error('Missing input');
    const userCart = await User.findById(_id).select('cart');
    const alreadyProduct = userCart?.cart?.find((item) => item.product.toString() === pid);
    if (alreadyProduct) {
        if (alreadyProduct.color === color) {
            const response = await User.updateOne(
                {
                    cart: { $elemMatch: alreadyProduct },
                },
                {
                    $set: { 'cart.$.quantity': quantity },
                },
                {
                    new: true,
                },
            );
            return res.json({
                status: response ? true : false,
                updatedUser: response ? response : 'Can not update cart',
            });
        } else {
            const response = await User.findByIdAndUpdate(
                _id,
                {
                    $push: { cart: { product: pid, quantity, color } },
                },
                { new: true },
            );
            return res.json({
                status: response ? true : false,
                updatedUser: response ? response : 'Can not update cart',
            });
        }
    } else {
        const response = await User.findByIdAndUpdate(
            _id,
            {
                $push: { cart: { product: pid, quantity, color } },
            },
            { new: true },
        );
        return res.json({
            status: response ? true : false,
            updatedUser: response ? response : 'Can not update cart',
        });
    }
    return res.json({
        status: response ? true : false,
        updatedUser: response ? response : 'Can not update new address',
    });
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
    finalRegister
};

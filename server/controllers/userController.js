const User = require('../models/user');
const asyncHandler = require('express-async-handler');
const { generateAccessToken, generateRefreshToken } = require('../middlewares/jwt');
const jwt = require('jsonwebtoken');
const sendMail = require('../ultils/sendMail');
const crypto = require('crypto');
//api register
//asyncHandler co cong dung hung nhung cai error va next toi thang tiep theo
const registerUser = asyncHandler(async (req, res) => {
    const { email, password, firstName, lastName } = req.body;
    if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({
            sucess: false,
            message: 'Email/ Password/ First Name/ Last Name/ Mobile are required fields. Please enter in full'
        });
    }
    const user = await User.findOne({ email });//{email: email}
    if (user) throw new Error(`Email: ${user.email} already existed!`);
    else {
        const newUser = await User.create(req.body);
        return res.status(200).json({
            success: newUser ? true : false,
            message: newUser ? `Create ${newUser.email} successfully. Please login` : 'Something went wrong. Please check again.'
        })
    }
})

//refreshToken dung de cap  moi 1 cai accessToken
//accessToken dung de xac thuc nguoi dung, phan quyen nguoi dung
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            sucess: false,
            message: 'Email/ Password are required fields. Please enter in full'
        });
    }
    //repsonse se la mot instance cua mongo chu khong phai la mot object thuan(plain object)
    const user = await User.findOne({ email });
    // console.log(response.isCorrectPassword(password));//Promise { <pending> }
    if (user && await user.isCorrectPassword(password)) {
        // console.log(user.isCorrectPassword(password));
        //su dung destructoring de remove passord va role khoi nguoi dung
        const { password, role, ...userData } = user.toObject();
        //tao accessToken va refeshToken
        const accessToken = generateAccessToken(user._id, role);
        const refreshToken = generateRefreshToken(user._id);
        //lu refresh token vao database
        await User.findByIdAndUpdate(user._id,
            { refreshToken },
            { new: true });
        //luu refrehToken vao cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        return res.status(200).json({
            success: true,
            accessToken,
            userData
        })
    } else {
        throw new Error('Invalid authentication!')
    }
})

const getCurrentUser = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    console.log(_id);
    const user = await User.findOne({ _id }).select('-refreshToken -password -role');
    return res.status(200).json({
        success: user ? true : false,
        result: user ? user : 'User not found'
    })
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    //lay token tu cookie
    const cookie = req.cookies;
    // check xem co token hay khong
    if (!cookie && !cookie['refreshToken']) {
        throw new Error('No refresh token in Cookie');
    }

    const result = await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: result._id, refreshToken: cookie.refreshToken });
    return res.status(200).json({
        success: user ? true : false,
        newAccessToken: user ? generateAccessToken(user._id, user.role) : 'Refresh Token not matched',
    })
})

const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie && !cookie.refreshToken) {
        throw new Error('No fresh token in cookies')
    }
    //xoa refreh token trong database
    await User.findOneAndUpdate(
        { refreshToken: cookie.refreshToken },
        { refreshToken: '' },
        { new: true })
    //xoa refresh token trong trinh duyet
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true
    });
    return res.status(200).json({
        success: true,
        message: 'Logout successfully'
    })
})

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
    const { email } = req.query;
    if (!email) {
        throw new Error('Missing Email');
    }
    const user = await User.findOne({ email });
    if (!user) {//neu email khong hop le hoac khong co
        throw new Error('User not found!');
    }

    //dung medthod reset token trong model
    const resetToken = user.createdPasswordChangeToken();
    await user.save();

    const html = `Please click the link below to change your password.This link will expire after 15 minutes. 
    <a href=${process.env.URL_SERVER}/api/user/resetpassword/${resetToken}>Click here</a>`

    const data = {
        email,
        html
    }
    const result = await sendMail(data);
    return res.status(200).json({
        success: result ? true : false,
        result
    })
})

const resetPassword = asyncHandler(async (req, res) => {
    const { password, token } = req.body;
    if (!password || !token) {
        throw new Error('Missing input')
    }
    const passwordResetToken = await crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({ passwordResetToken, passwordResetExpired: { $gt: Date.now() } });
    if (!user) {
        throw new Error('Invalid reset token');
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordChangeAt = Date.now();
    user.passwordResetExpired = undefined;

    await user.save();
    return res.status(200).json({
        success: user ? true : false,
        message: user ? 'Updated password successfully' : "Something went wrong!"
    })
});
module.exports = {
    registerUser,
    login,
    getCurrentUser,
    refreshAccessToken,
    logout,
    forgotPassword,
    resetPassword
}



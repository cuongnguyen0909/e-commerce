const User = require('../models/user');
const asyncHandler = require('express-async-handler');

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

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            sucess: false,
            message: 'Email/ Password are required fields. Please enter in full'
        });
    }
    //repsonse se la mot instance cua mongo chu khong phai la mot object thuan(plain object)
    const response = await User.findOne({ email });
    // console.log(response.isCorrectPassword(password));//Promise { <pending> }
    if (response && await response.isCorrectPassword(password)) {
        //su dung destructoring de remove passord va role khoi nguoi dung
        const { password, role, ...userData } = response.toObject();
        return res.status(200).json({
            success: true,
            userData
        })
    } else {
        throw new Error('Invalid authentication!')
    }
})

module.exports = {
    registerUser,
    login
}



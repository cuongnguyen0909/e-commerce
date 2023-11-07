const User = require('../models/user');
const asyncHandler = require('express-async-handler');

//api register
//asyncHandler co cong dung hung nhung cai error va next toi thang tiep theo
const registerUser = asyncHandler(async (req, res) => {
    const { email, password, firstName, lastName } = req.body;
    if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({
            sucess: false,
            message: 'Missing Input'
        });
    }
    const response = await User.create(req.body);
    return res.status(200).json({
        sucess: response ? true : false,
        response
    });
})

module.exports = {
    registerUser
}



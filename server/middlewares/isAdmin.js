const asyncHandler = require('express-async-handler');

const isAdmin = asyncHandler(async (req, res, next) => {
    const { role } = req.user;
    if (role !== 'admin') {
        return res.status(401).json({
            status: false,
            message: 'Require Admin role'
        });
    }
    next();
})

module.exports = isAdmin;
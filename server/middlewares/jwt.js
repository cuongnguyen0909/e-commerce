const jwt = require('jsonwebtoken');

// Hàm để tạo mã token truy cập
const generateAccessToken = (userId, role) => {
    // Sử dụng phương thức sign từ thư viện jsonwebtoken để tạo mã token
    return jwt.sign(
        {
            // Chứa thông tin cụ thể trong payload, ở đây bao gồm _id và role
            _id: userId,
            role: role
        },
        // Sử dụng JWT_SECRET từ môi trường để tạo mã ký và xác minh token
        process.env.JWT_SECRET,
        {
            // Xác định thời hạn sống của token là 3 ngày
            expiresIn: '3d'
        });
}

// Hàm để tạo mã token làm mới
const generateRefreshToken = (userId) => {
    // Sử dụng phương thức sign từ thư viện jsonwebtoken để tạo mã token
    return jwt.sign(
        {
            // Chứa thông tin cụ thể trong payload, ở đây chỉ bao gồm _id
            _id: userId
        },
        // Sử dụng JWT_SECRET từ môi trường để tạo mã ký và xác minh token
        process.env.JWT_SECRET,
        {
            // Xác định thời hạn sống của token là 7 ngày
            expiresIn: '7d'
        });
}

// Xuất hai hàm generateAccessToken và generateRefreshToken để sử dụng ở các nơi khác
module.exports = {
    generateAccessToken,
    generateRefreshToken
};

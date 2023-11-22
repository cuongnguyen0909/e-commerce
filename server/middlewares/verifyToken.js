const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

// Middleware để xác minh token
const verifyAccessToken = asyncHandler(async (req, res, next) => {
    // Kiểm tra xem header Authorization có bắt đầu bằng 'Bearer' không
    if (req?.headers?.authorization?.startsWith('Bearer')) {//Bearer token
        // Lấy token từ header Authorization
        const token = req.headers.authorization.split(' ')[1];
        // Xác minh token sử dụng secret key
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            // Nếu có lỗi trong quá trình xác minh token
            if (err) {
                // In ra dữ liệu được giải mã từ token (có thể là undefined nếu có lỗi)
                console.log(user);
                // Trả về phản hồi lỗi 401 nếu token không hợp lệ
                return res.status(401).json({
                    success: false,
                    message: 'Invalid access token'
                });
            } else {
                //Lưu thông tin người dùng từ token vào request
                //khi người dùng gửi req lên server thì trong req này nó đã có data rồi
                //nên sau đó mình có thể dùng những trường cần thiết để truy vấn dữ liệu từ server
                //cụ thể là nó next sang cái hàm tiếp theo trong route (getCurrentUser)
                req.user = user;
                // Chuyển điều khiển đến middleware tiếp theo
                next();
            }
        });
    } else {
        // Trả về phản hồi lỗi 401 nếu không tìm thấy chuỗi 'Bearer' trong header Authorization
        return res.status(401).json({
            success: false,
            message: 'Required authentication'
        });
    }
});

module.exports = {
    verifyAccessToken
};

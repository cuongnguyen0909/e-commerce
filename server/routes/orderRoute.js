const router = require('express').Router();
const orderController = require('../controllers/orderConroller');
const { verifyAccessToken } = require('../middlewares/verifyToken');
const isAdmin = require('../middlewares/isAdmin');

router.get('/', verifyAccessToken, orderController.getOrderByUser);
router.get('/admin', verifyAccessToken, isAdmin, orderController.getOrders);

router.post('/', verifyAccessToken, orderController.createOrder);
router.put('/status/:oid', verifyAccessToken, isAdmin, orderController.updateStatusOrder);
// router.delete('/:cid', [verifyAccessToken, isAdmin], couponController.deleteCoupon)

module.exports = router;

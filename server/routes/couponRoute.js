const router = require('express').Router();
const couponController = require('../controllers/couponController');
const { verifyAccessToken } = require('../middlewares/verifyToken');
const isAdmin = require('../middlewares/isAdmin');

router.post('/', [verifyAccessToken, isAdmin], couponController.createCoupon);
router.get('/', couponController.getCoupons);
router.put('/:cid', [verifyAccessToken, isAdmin], couponController.updateCoupon);
router.delete('/:cid', [verifyAccessToken, isAdmin], couponController.deleteCoupon);

module.exports = router;

const router = require('express').Router();
const userController = require('../controllers/userController');
const { verifyAccessToken } = require('../middlewares/verifyToken');
const isAdmin = require('../middlewares/isAdmin');
const uploadImage = require('../config/cloudinary.config');


router.post('/register', userController.registerUser);
router.put('/finalregister/:token', userController.finalRegister);

router.post('/login', userController.login);
router.post('/refreshtoken', userController.refreshAccessToken);
router.get('/logout', userController.logout);
router.get('/current', [verifyAccessToken], userController.getCurrentUser);
router.get('/', [verifyAccessToken, isAdmin], userController.getAllUser);
router.post('/forgotpassword', userController.forgotPassword);
router.put('/resetpassword', userController.resetPassword);
router.put('/changepassword', verifyAccessToken, userController.changePassword);

router.put('/address', verifyAccessToken, userController.updateAddress);
router.delete('/delete/:uid', [verifyAccessToken, isAdmin], userController.deleteUser);
router.put('/cart', verifyAccessToken, userController.updateCart);
router.put('/current', verifyAccessToken, uploadImage.single("avatar"), userController.updateUser);
router.delete('/remove-cart/:pid/:color', verifyAccessToken, userController.removeProductInCart);
router.put('/wishlist/:pid', verifyAccessToken, userController.updateWishlist);
router.put('/:uid', verifyAccessToken, isAdmin, userController.updateUserByAdmin);

module.exports = router;

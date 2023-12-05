const router = require('express').Router();
const userController = require('../controllers/userController');
const { verifyAccessToken } = require('../middlewares/verifyToken');
const isAdmin = require('../middlewares/isAdmin');

router.post('/register', userController.registerUser);
router.put('/finalregister/:token', userController.finalRegister);

router.post('/login', userController.login);
router.post('/refreshtoken', userController.refreshAccessToken);
router.get('/logout', userController.logout);
router.get('/current', [verifyAccessToken], userController.getCurrentUser);
router.get('/', [verifyAccessToken, isAdmin], userController.getAllUser);
router.post('/forgotpassword', userController.forgotPassword);
router.put('/resetpassword', userController.resetPassword);
router.put('/address', verifyAccessToken, userController.updateAddress);
router.delete('/', [verifyAccessToken, isAdmin], userController.deleteUser);
router.put('/cart', verifyAccessToken, userController.updateCart);

router.put('/current', verifyAccessToken, userController.updateUser);
router.put('/:uid', [verifyAccessToken, isAdmin], userController.updateUserByAdmin);

module.exports = router;

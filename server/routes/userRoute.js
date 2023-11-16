const router = require('express').Router();
const userController = require('../controllers/userController');
const { verifyAccessToken } = require('../middlewares/verifyToken');

router.post('/register', userController.registerUser);
router.post('/login', userController.login);
router.post('/refreshtoken', userController.refreshAccessToken)
router.get('/logout', userController.logout)
router.get('/current', verifyAccessToken, userController.getCurrentUser)
router.get('/forgotpassword', userController.forgotPassword)
router.put('/resetpassword', userController.resetPassword)



module.exports = router;
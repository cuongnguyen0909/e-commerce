const router = require('express').Router();
const productController = require('../controllers/productController');
const { verifyAccessToken } = require('../middlewares/verifyToken');
const isAdmin = require('../middlewares/isAdmin');
const uploadImage = require('../config/cloudinary.config')

router.post('/', [verifyAccessToken, isAdmin], productController.createProduct);
router.get('/', productController.getProducts);
router.put('/ratings', verifyAccessToken, productController.ratingProduct);
router.post('/insertdata', productController.insertData);

router.put('/uploadproductimage/:pid', [verifyAccessToken, isAdmin], uploadImage.array('images', 10), productController.uploadImageProduct);
router.put('/:pid', [verifyAccessToken, isAdmin], productController.updateProduct);
router.delete('/:pid', [verifyAccessToken, isAdmin], productController.deleteProduct);
router.get('/:pid', productController.getOneProduct);


module.exports = router;
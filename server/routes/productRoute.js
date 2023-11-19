const router = require('express').Router();
const productController = require('../controllers/productController');
const { verifyAccessToken } = require('../middlewares/verifyToken');
const isAdmin = require('../middlewares/isAdmin');

router.post('/', [verifyAccessToken, isAdmin], productController.createProduct);
router.get('/', productController.getAllProduct);
router.put('/:pid', [verifyAccessToken, isAdmin], productController.updateProduct);
router.delete('/:pid', [verifyAccessToken, isAdmin], productController.deleteProduct);


router.get('/:pid', productController.getOneProduct);




module.exports = router;
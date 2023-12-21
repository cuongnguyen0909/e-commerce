const router = require('express').Router();
const productController = require('../controllers/productController');
const { verifyAccessToken } = require('../middlewares/verifyToken');
const isAdmin = require('../middlewares/isAdmin');
const uploadImage = require('../config/cloudinary.config');

router.post('/', verifyAccessToken, isAdmin, uploadImage.fields([
    {
        name: 'images', maxCount: 10,
    },
    {
        name: 'thumb', maxCount: 1,
    }
]), productController.createProduct);
router.get('/', productController.getProducts);
router.put('/ratings', verifyAccessToken, productController.ratingProduct);
router.post('/insertdata', productController.insertData);

router.put(
    '/uploadproductimage/:pid',
    verifyAccessToken, isAdmin,
    uploadImage.fields([
        {
            name: 'images', maxCount: 10,
        },
        {
            name: 'thumb', maxCount: 1,
        }
    ]),
    productController.uploadImageProduct,
);
router.put(
    '/varriant/:pid',
    verifyAccessToken, isAdmin,
    uploadImage.fields([
        {
            name: 'images', maxCount: 10,
        },
        {
            name: 'thumb', maxCount: 1,
        }
    ]),
    productController.addVarriant,
);
router.put('/:pid', verifyAccessToken, isAdmin, uploadImage.fields([
    {
        name: 'images', maxCount: 10,
    },
    {
        name: 'thumb', maxCount: 1,
    }
]), productController.updateProduct);
router.delete('/:pid', verifyAccessToken, isAdmin, productController.deleteProduct);
router.get('/:pid', productController.getOneProduct);

module.exports = router;

const router = require('express').Router();
const proCategoryController = require('../controllers/proCategoryController');
const { verifyAccessToken } = require('../middlewares/verifyToken');
const isAdmin = require('../middlewares/isAdmin');

router.post('/', [verifyAccessToken, isAdmin], proCategoryController.createProductCategory);
router.get('/', proCategoryController.getProductCategories);
router.post('/insertdata', proCategoryController.insertData);

router.put('/:pcid', [verifyAccessToken, isAdmin], proCategoryController.updateProductCategory);
router.delete('/:pcid', [verifyAccessToken, isAdmin], proCategoryController.deleteProductCategory);

module.exports = router;

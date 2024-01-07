const router = require('express').Router();
const proCategoryController = require('../controllers/proCategoryController');
const { verifyAccessToken } = require('../middlewares/verifyToken');
const isAdmin = require('../middlewares/isAdmin');

router.post('/', [verifyAccessToken, isAdmin], proCategoryController.createOrUpdateProductCategory);
router.get('/', proCategoryController.getProductCategories);
router.post('/insertdata', proCategoryController.insertData);

router.put('/:pcid', [verifyAccessToken, isAdmin], proCategoryController.updateProductCategory);
// Route để xóa category dựa trên title
router.delete('/:title', [verifyAccessToken, isAdmin], proCategoryController.deleteCategory);
router.delete('/:title/:brand?', [verifyAccessToken, isAdmin], proCategoryController.deleteBrand);

module.exports = router;

const router = require('express').Router();
const blogCategoryController = require('../controllers/blogCategoryController');
const { verifyAccessToken } = require('../middlewares/verifyToken');
const isAdmin = require('../middlewares/isAdmin');

router.post('/', [verifyAccessToken, isAdmin], blogCategoryController.createBlogCategory)
router.get('/', blogCategoryController.getBlogCategories)
router.put('/:bcid', [verifyAccessToken, isAdmin], blogCategoryController.updateBlogCategory)
router.delete('/:bcid', [verifyAccessToken, isAdmin], blogCategoryController.deleteBlogCategory)

module.exports = router;
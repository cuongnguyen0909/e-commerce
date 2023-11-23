const router = require('express').Router();
const blogController = require('../controllers/blogController');
const { verifyAccessToken } = require('../middlewares/verifyToken');
const isAdmin = require('../middlewares/isAdmin');

router.post('/', [verifyAccessToken, isAdmin], blogController.createNewBlog);
router.get('/', blogController.getAllBlog);

router.put('/like/:bid', verifyAccessToken, blogController.likeBlog);
router.put('/dislike/:bid', verifyAccessToken, blogController.disLikeBlog);
router.get('/:bid', blogController.getOneBlog);
router.put('/:bid', [verifyAccessToken, isAdmin], blogController.updateBlog);
router.delete('/:bid', [verifyAccessToken, isAdmin], blogController.deleteBlog);


module.exports = router;
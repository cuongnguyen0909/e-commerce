const userRouter = require('./userRoute');
const productRouter = require('./productRoute');
const productCategoryRouter = require('./productCategoryRoute');
const orderRouter = require('./orderRoute');
const { notFound, errorHandler } = require('../middlewares/errorHandler');
const router = require('./productRoute');
const initRoutes = (app) => {
    //api neu khong khp -> notFound
    //api chay nhung co loi trong luc chay -> errorHandler
    //neu tat ca cac api khong khop thi no se chay xuong thang notFound => tra ve loi 404
    //con trong qua trinh chay api co loi thi se chay xuong thang errorHandler
    app.use('/api/v1/user', userRouter);
    app.use('/api/v1/product', productRouter);
    app.use('/api/v1/productcategories', productCategoryRouter);
    app.use('/api/v1/order', orderRouter);

    app.use(notFound);
    app.use(errorHandler);
};

module.exports = initRoutes;

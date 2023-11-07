const userRouter = require('./userRoute');
const { notFound, errorHandler } = require('../middlewares/errorHandler')
const initRoutes = (app) => {
    //api neu khong khp -> notFound
    //api chay nhung co loi trong luc chay -> errorHandler
    //neu tat ca cac api khong khop thi no se chay xuong thang notFound => tra ve loi 404
    //con trong qua trinh chay api co loi thi se chay xuong thang errorHandler
    app.use('/api/user', userRouter);


    app.use(notFound);
    app.use(errorHandler);
}

module.exports = initRoutes;
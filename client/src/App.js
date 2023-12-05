import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Login, Home, Public, FAQs, Service, Blog, DetailProduct, Product, FinalRegister, ResetPassword } from './pages/public';
import path from './ultils/path';
import { getCategories } from './store/app/appAction';
import { useDispatch } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getCategories());
    }, []);

    return (
        <div className="min-h-screen font-main">
            <Routes>
                <Route path={path.PUBLIC} element={<Public />}>
                    <Route path={path.HOME} element={<Home />} />
                    <Route path={path.BLOG} element={<Blog />} />
                    <Route path={path.DETAIL_PRODUCT__CATEGORY__PID__TITLE} element={<DetailProduct />} />
                    <Route path={path.FAQS} element={<FAQs />} />
                    <Route path={path.SERVICE} element={<Service />} />
                    <Route path={path.SERVICE} element={<Service />} />
                    <Route path={path.PRODUCT} element={<Product />} />
                </Route>
                <Route path={path.LOGIN} element={<Login />} />
                <Route path={path.RESET_PASSWORD} element={<ResetPassword />} />
                <Route path={path.FINAL_REGISTER} element={<FinalRegister />} />
            </Routes>
            <ToastContainer >
                posistion="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            </ToastContainer>
        </div>
    );
}
export default App;

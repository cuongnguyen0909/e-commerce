import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Login, Home, Public, FAQs, Service, Blog, DetailProduct, Product } from './pages/public';
import path from './ultils/path';
import { getCategories } from './store/app/asyncAction';
import { useDispatch } from 'react-redux';
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
                    <Route path={path.DETAIL_PRODUCT__PID__TITLE} element={<DetailProduct />} />
                    <Route path={path.FAQS} element={<FAQs />} />
                    <Route path={path.SERVICE} element={<Service />} />
                    <Route path={path.PRODUCT} element={<Product />} />
                </Route>
                <Route path={path.LOGIN} element={<Login />} />
            </Routes>
        </div>
    );
}
export default App;

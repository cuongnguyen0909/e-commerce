import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import {
    Login, Home, Public, FAQs, Service, Blog, DetailProduct,
    ListProduct, FinalRegister, ResetPassword, ShowProductSearch
} from './pages/public';

import { AdminLayout, Dashboard, ManageOrder, ManageProduct, ManageUser, CreateProduct } from './pages/admin';
import { MemberLayout, Personal } from './pages/member';
import path from './ultils/path';
import { getCategories } from './store/app/appAction';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Modal } from './components';

function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getCategories());
    }, []);

    const { isShowModal, modalChildren } = useSelector(state => state.app);

    return (
        <div className="font-main relative">
            {isShowModal && <Modal>{modalChildren}</Modal>}
            <Routes>
                <Route path={path.PUBLIC} element={<Public />}>
                    <Route path={path.HOME} element={<Home />} />
                    <Route path={path.BLOG} element={<Blog />} />
                    <Route path={path.SHOW_PRODUCT_SEARCH} element={<ShowProductSearch />} />
                    <Route path={path.LISTPRODUCT} element={<ListProduct />} />
                    <Route path={path.DETAIL_PRODUCT__CATEGORY__PID__TITLE} element={<DetailProduct />} />
                    <Route path={path.FAQS} element={<FAQs />} />
                    <Route path={path.SERVICE} element={<Service />} />
                    <Route path={path.ALL} element={<Home />} />
                </Route>
                <Route path={path.ADMIN} element={<AdminLayout />}>
                    <Route path={path.DASHBOARD} element={<Dashboard />} />
                    <Route path={path.MANAGE_USER} element={<ManageUser />} />
                    <Route path={path.CREATE_PRODUCT} element={<CreateProduct />} />
                    <Route path={path.MANAGE_PRODUCT} element={<ManageProduct />} />
                    <Route path={path.MANAGE_ORDER} element={<ManageOrder />} />
                </Route>
                <Route path={path.MEMBER} element={<MemberLayout />}>
                    <Route path={path.PERSONAL} element={<Personal />} />
                </Route>
                <Route path={path.RESET_PASSWORD} element={<ResetPassword />} />
                <Route path={path.LOGIN} element={<Login />} />
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

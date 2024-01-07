import React, { memo, useEffect, useState } from 'react';
import logo from '../../assets/images/logo.png';
import icons from '../../ultils/icons';
import { Link } from 'react-router-dom';
import path from '../../ultils/path';
import { useSelector, useDispatch } from 'react-redux';
import { Fragment } from 'react';
import { logout } from '../../store/user/userSlice';
import { showCart } from '../../store/app/appSlice';
const Header = () => {
    const dispatch = useDispatch();
    const { MdLocalPhone, MdMarkEmailRead, HiOutlineShoppingCart, FaUserShield } = icons;
    const { isLoggedIn, current } = useSelector(state => state.user);
    // console.log(current?.role)
    const [isShowOption, setIsShowOption] = useState(false);
    useEffect(() => {
        const handleClickOutside = (e) => {
            const profile = document.getElementById('profile');
            if (!profile?.contains(e.target)) {
                setIsShowOption(false);
            }
        }
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        }
    }, [])
    return (
        <div className=" w-main flex justify-between h-[110px] py-[35px]">
            <Link to={`/${path.HOME}`}>
                <img src={logo} alt="logo" className="w-[234px] object-contain" />
            </Link>
            <div className="flex text-[13px] ">
                <div className="flex flex-col px-6 border-r items-center">
                    <span className="flex gap-4 items-center">
                        <MdLocalPhone color="red" />
                        <span className="font-semibold"> (+84)123456789</span>
                    </span>
                    <span>Mon-Sat 9:00AM - 8:00PM</span>
                </div>
                <div className="flex flex-col px-6 border-r items-center">
                    <span className="flex gap-4 items-center">
                        <MdMarkEmailRead color="red" />
                        <span className="font-semibold"> SUPPORT@GMAIL.COM</span>
                    </span>
                    <span>Online Support 24/7</span>
                </div>
                {isLoggedIn && <Fragment>
                    <div
                        title='View cart'
                        onClick={() => dispatch(showCart())}
                        className="flex items-center px-6 border-r justify-center gap-2 cursor-pointer">
                        <HiOutlineShoppingCart color="red" />
                        <span>{`${current?.cart?.length || 0} items`}</span>
                    </div>
                    <div
                        className="flex items-center px-6 border-r justify-center gap-2 cursor-pointer relative"
                        onClick={() => setIsShowOption(prev => !prev)}
                        id='profile'
                    >
                        <FaUserShield color='red' />
                        <span>Account</span>
                        {isShowOption &&
                            <div className='absolute top-full flex flex-col z-50 left-[16px] bg-gray-100 border min-w-[150px] py-2'
                                onClick={e => e.stopPropagation()}>
                                <Link
                                    className='p-2 hover:bg-gray-200 w-full'
                                    to={`/${path.MEMBER}/${path.PERSONAL}`}>
                                    Personal
                                </Link>
                                {+current.role === 2002 &&
                                    <Link className='p-2 hover:bg-gray-200 w-full'
                                        to={`/${path.ADMIN}/${path.DASHBOARD}`}>
                                        Admin Workspace
                                    </Link>}
                                <span
                                    onClick={() => dispatch(logout())}
                                    className='p-2 hover:bg-gray-200 w-full'>Logout</span>
                            </div>}
                    </div>
                </Fragment>}
            </div>
        </div>
    );
};

export default memo(Header);

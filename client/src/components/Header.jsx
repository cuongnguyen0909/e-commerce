import React, { memo } from 'react';
import logo from '../assets/logo.png';
import icons from '../ultils/icons';
import { Link } from 'react-router-dom';
import path from '../ultils/path';

const { MdLocalPhone, MdMarkEmailRead, HiOutlineShoppingCart, FaUserShield } = icons;
const Header = () => {
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
                <div className="flex items-center px-6 border-r justify-center gap-2 cursor-pointer">
                    <HiOutlineShoppingCart color="red" />
                    <span>0 items</span>
                </div>
                <div className="flex items-center px-6 border-r justify-center gap-2 cursor-pointer">
                    <FaUserShield color='red' />
                    <span>profile</span>
                </div>
            </div>
        </div>
    );
};

export default memo(Header);

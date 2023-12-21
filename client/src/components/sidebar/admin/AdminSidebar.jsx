import React, { memo, Fragment, useState, useEffect } from 'react'
import logo from '../../../assets/logo.png';
import { adminSideBar } from '../../../ultils/constants';
import { Link, NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { IoCaretDownSharp, IoCaretForward } from "react-icons/io5";
import path from '../../../ultils/path';


const activeStyle = 'px-4 py-2 flex items-center gap-2 text-gray-900 bg-blue-400'
const notActiveStyle = 'px-4 py-2 flex items-center gap-2 text-gray-900 hover:bg-blue-300'
const AdminSidebar = () => {
    const [actived, setActived] = useState([])
    const handleShowTabs = (id) => {
        if (actived.some(item => item === id)) {
            setActived(prev => prev.filter(item => item !== id));
        } else {
            setActived(prev => [...prev, id]);
        }
    }
    return (
        <div className='py-4 bg-white h-full'>
            <Link
                to={`/${path.HOME}`}
                className='flex flex-col justify-center items-center py-4 gap-2'>
                <img src={logo} alt='logo' className='w-[200px] object-contain' />
                <small>Admin</small>
            </Link>
            <div>
                {adminSideBar?.map(item => (
                    <Fragment key={item.id}>
                        {item.type === 'SINGLE' &&
                            <NavLink to={item.path}
                                className={({ isActive }) => clsx(isActive && activeStyle, !isActive && notActiveStyle)}
                            >
                                <span>{item.icon}</span>
                                <span>{item.text}</span>
                            </NavLink>}
                        {item.type === 'PARENT' &&
                            <div onClick={() => handleShowTabs(+item.id)}
                                className='flex flex-col text-gray-900'>
                                <div
                                    className='flex justify-between items-center gap-2 px-4 py-2 hover:bg-blue-300 cursor-pointer'
                                >
                                    <div className='flex justify-center items-center gap-2'>
                                        <span>{item.icon}</span>
                                        <span>{item.text}</span>
                                    </div>
                                    {actived.some(id => +id == +item.id) ? <IoCaretForward /> : <IoCaretDownSharp />}
                                </div>
                                {actived.some(id => +id == +item.id) &&
                                    <div className='flex flex-col pl-6'
                                    >
                                        {item.subMenu?.map((subItem, index) => (
                                            <NavLink
                                                key={index}
                                                onClick={e => e.stopPropagation()}
                                                to={subItem.path}
                                                className={({ isActive }) => clsx(isActive && activeStyle, !isActive && notActiveStyle, 'pl-6')}>
                                                {subItem.text}
                                            </NavLink>
                                        ))}
                                    </div>}
                            </div>}
                        <div>
                        </div>
                    </Fragment>
                ))}
            </div>
        </div >
    )
}

export default memo(AdminSidebar)
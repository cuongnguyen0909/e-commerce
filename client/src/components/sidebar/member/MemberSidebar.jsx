import React, { memo, Fragment, useState, useEffect } from 'react'
import avatar from '../../../assets/avatar.png';
import { memberSideBar } from '../../../ultils/constants';
import { Link, NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { IoCaretDownSharp, IoCaretForward } from "react-icons/io5";
import path from '../../../ultils/path';
import { useSelector } from 'react-redux';
import { IoReturnDownBackSharp } from "react-icons/io5";



const activeStyle = 'px-4 py-2 flex items-center gap-2 text-gray-900 bg-blue-400'
const notActiveStyle = 'px-4 py-2 flex items-center gap-2 text-gray-900 hover:bg-blue-300'
const MemberSidebar = () => {
    const [actived, setActived] = useState([]);
    const { current } = useSelector(state => state.user);
    const handleShowTabs = (id) => {
        if (actived.some(item => item === id)) {
            setActived(prev => prev.filter(item => item !== id));
        } else {
            setActived(prev => [...prev, id]);
        }
    }
    return (
        <div className='py-4 bg-white h-full w-[250px] flex-none'>
            <div
                className='w-full flex flex-col items-center justify-center py-4'>
                <img src={current?.avatar || avatar} alt='avatar' className='w-[100px] rounded-full object-contain' />
                <small>{`${current?.lastName} ${current?.firstName}`}</small>
            </div>
            <div>
                {memberSideBar?.map(item => (
                    <Fragment key={item.id}>
                        {item.type === 'SINGLE' &&
                            <NavLink to={item.path}
                                className={({ isActive }) => clsx(isActive && activeStyle, !isActive && notActiveStyle)}
                            >
                                <span>{item.icon}</span>
                                <span>{item.text}</span>
                            </NavLink>}

                        <div>
                        </div>
                    </Fragment>
                ))}
            </div>
            <Link
                to={`${'/'}`}>
                <div className='flex px-4 gap-2 text-main'>
                    <IoReturnDownBackSharp size={28} />
                    Homepage
                </div>
            </Link>
        </div >
    )
}

export default memo(MemberSidebar)
import clsx from 'clsx';
import React, { Fragment, memo, useState } from 'react';
import { IoReturnDownBackSharp } from "react-icons/io5";
import { useSelector } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import avatar from '../../../assets/images/avatar.png';
import { memberSideBar } from '../../../ultils/constants';
import { FaHome } from "react-icons/fa";

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
        <div className='py-4 bg-white h-full w-[250px] flex-none font-medium'>
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
                <div className='flex justify-start items-center px-4 font-bold gap-2 text-main hover:bg-gray-400'>
                    <FaHome size={24} />
                    <IoReturnDownBackSharp size={20} />
                    Homepage
                </div>
            </Link>
        </div >
    )
}

export default memo(MemberSidebar)
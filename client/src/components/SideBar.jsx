import React from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { createSlug } from '../ultils/helpers';

const SideBar = () => {
    const { categories } = useSelector(state => state.app);
    // console.log(categories);
    // const { isLoading } = useSelector(state => state.app);
    // console.log(isLoading);
    return (
        <div className='flex flex-col border'>
            {categories?.map(item => (
                <NavLink
                    key={createSlug(item.title)}
                    to={createSlug(item.title)}
                    className={({ isActive }) => isActive ? 'bg-main text-white px-5 pt-[15px] pb-[14px] text- hover:text-main'
                        : 'px-5 pt-[15px] pb-[14px] text-sm hover:text-main'}
                >
                    {item?.title}
                </NavLink>
            ))}
        </div>
    )
};

export default SideBar;
import React, { Fragment, memo, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { createSlug } from '../../../ultils/helpers';
import { MdOutlinePhoneIphone } from "react-icons/md";
import { FaTabletScreenButton } from "react-icons/fa6";
import { FaLaptop } from "react-icons/fa";
import { MdAutorenew } from "react-icons/md";
import { apiGetCategories } from '../../../apis';


const HomeSidebar = () => {
    const [categories, setCategories] = useState(null);
    const fetchCategories = async () => {
        const response = await apiGetCategories();
        if (response?.status) {
            setCategories(response?.proCategories)
        }
    }
    useEffect(() => {
        fetchCategories();
    }, [categories])
    // const { categories } = useSelector(state => state.app);
    return (
        <div className='flex flex-col border h-[500px]'>
            {categories?.map(item => (
                <div className='flex items-center pl-8 '>
                    {item?.title === 'Smartphone' && <MdOutlinePhoneIphone size={20} color='#4942E4' />}
                    {item?.title === 'Tablet' && <FaTabletScreenButton size={20} color='#4942E4' />}
                    {item?.title === 'Laptop' && <FaLaptop size={20} color='#4942E4' />}
                    {item?.title !== 'Smartphone' && item?.title !== 'Tablet' && item?.title !== 'Laptop' && <MdAutorenew size={20} color='#4942E4' />}
                    <NavLink
                        key={createSlug(item.title)}
                        to={createSlug(item.title)}
                        className={({ isActive }) => isActive ? 'bg-main text-white px-5 pt-[15px] pb-[14px] text- hover:text-main'
                            : 'px-5 pt-[15px] pb-[14px] text-sm hover:text-main'}
                    >
                        {item?.title}
                    </NavLink>
                </div>
            ))}
        </div>
    )
}

export default memo(HomeSidebar)
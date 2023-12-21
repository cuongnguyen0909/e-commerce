import React, { memo } from 'react'
import icons from '../../ultils/icons';

const { FaHeart, IoEyeSharp, IoMenu } = icons;

const iconList = [
    {
        id: 1,
        name: <FaHeart />
    },
    {
        id: 2,
        name: <IoEyeSharp />
    },
    {
        id: 3,
        name: <IoMenu />
    }
]

const SelectOptions = ({ icon }) => {
    return (
        <div className='flex gap-2'
        >
            <div
                className='hover:border-gray-800 hover:bg-gray-800 hover:text-white 
                cursor-pointer w-[40px] shadow-md border h-[40px] rounded-full 
                bg-gray-200 flex justify-center items-center'>
                {icon}
            </div>
        </div>
    )
}

export default memo(SelectOptions); 
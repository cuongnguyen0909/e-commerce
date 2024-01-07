import React, { memo } from 'react'
import clsx from 'clsx';
const SelectOptions = ({ icon, isAddToCart, isAddTiWishlist }) => {
    return (
        <div className='flex gap-2'>
            <div
                className={clsx('hover:border-gray-600 hover:bg-gray-600 hover:text-white cursor-pointer w-[40px] shadow-md border h-[40px] rounded-full bg-gray-200 flex justify-center items-center', isAddToCart && 'hover:border-sky-400 hover:bg-sky-400', isAddTiWishlist && 'hover:border-gray-400 hover:bg-blue-400')}>
                {icon}
            </div>
        </div>
    )
}

export default memo(SelectOptions); 
import React, { memo } from 'react'

const SelectQuantity = ({ quantity, handleQuantity, handleChangeQuantity }) => {
    // console.log(quantity);
    return (
        <div className='flex items-center h-[25px] border bg-gray-100 border-gray-50 hover:bg-gray-300'>
            <span onClick={() => handleChangeQuantity(quantity - 1)}
                className='flex items-center h-full cursor-pointer p-2 border-r border-black '>-</span>
            <input
                value={quantity}
                onChange={e => handleQuantity(e.target.value)}
                className='py-2 text-center outline-none w-[35px] text-black' type='number' />
            <span onClick={() => handleChangeQuantity(quantity + 1)}
                className='flex items-center h-full cursor-pointer p-2 border-l border-black'>+</span>
        </div>
    )
}

export default memo(SelectQuantity)
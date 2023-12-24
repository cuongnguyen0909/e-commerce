import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { Breadcrumb, Button, CartItemInDetailCart } from '../../components';
import { formatMoney } from '../../ultils/helpers';
import path from '../../ultils/path';
const DetailCart = () => {
    const location = useLocation();
    const { currentCart } = useSelector(state => state.user);
    // console.log(current.cart)
    console.log(currentCart)
    return (
        <div className='w-full'>
            {/* <div className='h-[81px] flex justify-center items-center bg-gray-100'>
                <div className='w-main'>
                <Breadcrumb pathname={location?.pathname} />
                </div>
            </div> */}
            <header className='font-semibold text-[24px] uppercase'>MY cart</header>
            <div className='flex flex-col border my-8 w-main mx-auto '>
                <div className='w-main mx-auto bg-gray-200 font-bold py-3 grid grid-cols-10'>
                    <span className='col-span-6 w-full text-center'>Products</span>
                    <span className='col-span-1 w-full text-center'>Quantity</span>
                    <span className='col-span-3 w-full text-center'>Price</span>
                </div>
                {currentCart?.map(item => (
                    <CartItemInDetailCart
                        key={item._id}
                        dfQuantity={item?.quantity}
                        color={item?.color}
                        title={item?.title}
                        thumb={item?.thumb}
                        price={item?.price}
                        pid={item.product?._id} />
                ))}
            </div>
            <div className='w-main mx-auto flex mb-12 flex-col justify-center items-end gap-3'>
                <div className='flex items-center gap-8 text-sm'>
                    <span className='text-[20px] font-semibold'>Subtotal:</span>
                    <span className='text-main text-[20px] font-bold'>
                        {formatMoney(currentCart?.reduce((sum, item) => sum + (Number(item?.price) * Number(item?.quantity)), 0)) + ' VND'}</span>
                </div>
                <span className='text-xs italic'>Shipping, taxes, and discounts calculated at checkout.</span>
                <Link
                    target='_blank'
                    className='bg-main text-white px-8 py-3 rounded-md hover:bg-[#ff6f61] transition-all duration-300'
                    to={`/${path.CHECKOUT}`} >Checkout</Link>
            </div>
        </div >

    )
}

export default DetailCart
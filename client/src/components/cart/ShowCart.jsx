import React, { memo } from 'react'
import { IoMdClose } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { showCart } from '../../store/app/appSlice';
import { formatMoney } from '../../ultils/helpers';
import { Button } from '..';
import { IoRemoveCircleOutline } from "react-icons/io5";
import { getCurrent } from '../../store/user/userAction';
import { toast } from 'react-toastify';
import { apiRemoveProdcutInCart } from '../../apis';
import { useNavigate } from 'react-router-dom';
import path from '../../ultils/path';
const ShowCart = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentCart } = useSelector(state => state.user);
    const totalPrice = currentCart?.reduce((sum, item) => sum + Number(item?.price) * Number(item?.quantity), 0);
    // console.log(current)
    const updateCart = async (pid, color) => {
        const response = await apiRemoveProdcutInCart(pid, color);
        if (response.status) {
            toast.success('Remove product in cart successfully');
            dispatch(getCurrent());
        } else {
            toast.error(response.message);
        }
        console.log(currentCart)
    }
    return (
        <div
            onClick={e => e.stopPropagation()}
            className='w-[400px] h-screen overflow-hidden bg-gray-900 grid grid-rows-10 text-white py-1 px-6'>
            <header className=' border-b border-gray-500 flex justify-between items-center row-span-1 h-full font-bold text-2xl'>
                <span className='text-[20px]'>YOUR CART</span>
                <span
                    onClick={() => dispatch(showCart())}
                    className='cursor-pointer p-2'><IoMdClose /></span>
            </header>

            {/* //cart info */}
            <section className='row-span-7 flex flex-col gap-3 h-full max-h-full overflow-y-auto py-3'>
                {!currentCart &&
                    <span className='text-xs italic'>
                        Your cart is empty
                    </span>}
                {currentCart && currentCart.map((item, index) => (
                    <div key={index} className='flex gap-2 justify-between items-center '>
                        <div className='flex gap-2'>
                            <img src={item?.thumb} alt="thumb" className='w-16 h-16 object-cover' />
                            <div className='flex flex-col gap-1'>
                                <div className='flex gap-4'>
                                    <span className='font-bold text-main text-[13px]'>{item?.title}</span>
                                    <span className='text-[12px] font-bold'> x{item?.quantity}</span>
                                </div>
                                <span className='text-[12px] '>{item?.color}</span>
                                <span className='text-[12px]'>{`${formatMoney(item?.price)} VND`}</span>
                            </div>
                        </div>
                        <span
                            title='Remove product'
                            onClick={() => updateCart(item?.product?._id, item?.color)}
                            className='h-8 w-8 rounded-full flex justify-center items-center hover:bg-gray-700 cursor-pointer'>
                            <IoRemoveCircleOutline size={16} />
                        </span>
                    </div>
                ))
                }
            </section >


            {/* //checkout */}
            < div className='row-span-2 h-full flex flex-col justify-between' >
                <div className='flex items-center justify-between pt-4 border-t'>
                    <span>Subtotal: </span>
                    <span>{formatMoney(totalPrice) + ' VND'}</span>
                </div>
                <span className='text-xs italic text-gray-600'>
                    Shipping, taxes, and discounts calculated at checkout.
                </span>
                <Button
                    handleOnClick={() => {
                        navigate(`/${path.MEMBER}/${path.MY_CART}`);
                        dispatch(showCart());
                    }}
                    style='rounded-none w-full bg-main py-3'>Shopping Cart</Button>
            </div >
        </div >
    )
}

export default memo(ShowCart);
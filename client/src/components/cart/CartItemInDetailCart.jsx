import React, { memo, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateCart } from '../../store/user/userSlice';
import { formatMoney } from '../../ultils/helpers';
import SelectQuantity from '../products/SelectQuantity';
import { toast } from 'react-toastify';
import { apiRemoveProdcutInCart } from '../../apis';
import { getCurrent } from '../../store/user/userAction';
import { IoRemoveCircleOutline } from 'react-icons/io5';
const CartItemInDetailCart = ({ item, color, dfQuantity = 1, title, price, thumb, pid }) => {
    const dispatch = useDispatch();
    const [quantity, setQuantity] = useState(() => dfQuantity);


    const handleQuantity = async (number) => {
        const parsedNumber = +number;
        if (isNaN(parsedNumber) || parsedNumber === 0) {
            const response = await apiRemoveProdcutInCart(pid, color);
            if (response.status) {
                toast.success('Remove product in cart successfully');
                dispatch(getCurrent());
            } else {
                toast.error(response.message);
            }
        }
        setQuantity(parsedNumber);
    }

    const handleRemoveCart = async (pid, color) => {
        const response = await apiRemoveProdcutInCart(pid, color);
        if (response.status) {
            toast.success('Remove product in cart successfully');
            dispatch(getCurrent());
        } else {
            toast.error(response.message);
        }
    }

    const handleChangeQuantity = async (number) => {
        if (+number === 0) {
            const response = await apiRemoveProdcutInCart(pid, color);
            if (response.status) {
                toast.success('Remove product in cart successfully');
                dispatch(getCurrent());
            } else {
                toast.error(response.message);
            }
        }
        setQuantity(+number);
    }

    useEffect(() => {
        const parsedQuantity = +quantity;
        if (!isNaN(parsedQuantity)) {
            dispatch(updateCart({ pid: pid, quantity: parsedQuantity, color }));
        }
    }, [quantity])

    return (
        <div className='w-main mx-auto border-b-2 font-bold my-8 py-3 grid grid-cols-10'>
            <span className='col-span-5 w-full text-center'>
                <div className='flex gap-6 px-4 py-2'>
                    <img src={thumb} alt="thumb" className='w-[200px] h-[150px] object-contain' />
                    <div className='flex flex-col items-start gap-1'>
                        <span className='font-bold text-main text-[14px]'>{title}</span>
                        <span className='text-[12px] font-main'>{color}</span>
                        {/* <span className='text-[12px]'>{`${formatMoney(item?.product?.price)} VND`}</span> */}
                    </div>
                </div>
            </span>
            <span className='col-span-1 w-full text-center'>
                <div className='flex items-center gap-4 h-full'>
                    <SelectQuantity
                        quantity={quantity}
                        handleQuantity={handleQuantity}
                        handleChangeQuantity={handleChangeQuantity} />
                </div>
            </span>
            <span className='col-span-3 w-full text-center h-full flex justify-center items-center'>
                <span className='text-[16px]'>{`${formatMoney(price * quantity)} VND`}</span>
            </span>
            <span className='col-span-1 w-full text-center h-full flex justify-center items-center'>
                <span
                    title='Remove product'
                    onClick={() => handleRemoveCart(pid, color)}
                    className='h-8 w-8 rounded-full flex justify-center items-center hover:bg-gray-300 cursor-pointer'>
                    <IoRemoveCircleOutline title='Remove product' size={16} />
                </span>
            </span>
        </div >
    )
}

export default memo(CartItemInDetailCart);
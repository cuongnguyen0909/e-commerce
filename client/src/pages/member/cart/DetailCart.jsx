import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, CartItemInDetailCart } from '../../../components';
import { formatMoney } from '../../../ultils/helpers';
import Swal from 'sweetalert2';
import path from '../../../ultils/path';
import { createSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { apiGetOneProduct, apiUpdateCart } from '../../../apis';
const DetailCart = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { currentCart, current } = useSelector(state => state.user);
    const [isValid, setIsValid] = useState(false)
    // console.log(current.cart)
    console.log(currentCart)
    const totalPrice = currentCart?.reduce((sum, item) => sum + (Number(item?.price) * Number(item?.quantity)), 0);
    const handleSubmit = () => {
        if (currentCart.length === 0) {
            setIsValid(false)
            return Swal.fire({
                icon: 'error',
                title: 'Opps...',
                text: 'Your cart is empty',
                showCancelButton: true,
                confirmButtonText: 'Go shopping',
                cancelButtonText: 'Cancel'
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate({
                        pathname: `/${path.HOME}`,
                    })
                }
            })
        }

        if (!current?.address) {
            setIsValid(false)
            return Swal.fire({
                icon: 'error',
                title: 'Opps...',
                text: 'Please update your address before checkout',
                showCancelButton: true,
                confirmButtonText: 'Update now',
                cancelButtonText: 'Cancel'
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate({
                        pathname: `/${path.MEMBER}/${path.PERSONAL}`,
                        search: createSearchParams({ redirect: location.pathname }).toString()
                    })
                }
            })
        } else {
            setIsValid(true)
        }

        if (isValid) {
            navigate(`/${path.CHECKOUT}`)
        }
    }

    const handleUpdateCart = async () => {
        if (currentCart.length === 0) {
            return Swal.fire({
                icon: 'error',
                title: 'Opps...',
                text: 'Your cart is empty',
                showCancelButton: true,
                confirmButtonText: 'Go shopping',
                cancelButtonText: 'Cancel'
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate({
                        pathname: `/${path.HOME}`,
                    })
                }
            })
        } else {
            currentCart?.map(async (item) => {
                const response = await apiGetOneProduct(item?.product?._id);
                // console.log(response)
                console.log(item)
                // console.log(item?.quantity)
                if ((+response?.product?.quantity) < (+item?.quantity)) {
                    return Swal.fire({
                        icon: 'error',
                        title: 'Opps...',
                        text: `Sorry, we don't have enough ${item?.title} in stock`,
                        showCancelButton: true,
                        cancelButtonText: 'Cancel'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            navigate(`/${path.MEMBER}/${path.MY_CART}`)
                        }
                    })
                }
                const updatedCart = await apiUpdateCart({
                    pid: item?.product?._id,
                    color: item?.color,
                    quantity: +item?.quantity,
                    price: item?.price,
                    thumb: item?.thumb,
                    title: item?.title,
                    productQuantity: +response?.product?.quantity
                })
                if (updatedCart.status) {
                    return Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'Update cart successfully',
                        showCancelButton: true,
                        cancelButtonText: 'Cancel'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            navigate(`/${path.MEMBER}/${path.MY_CART}`)
                        }
                    })
                }
            })
        }
        // const response = await apiUpdateCart({
        //     pid: productData?._id,
        //     color: productData?.color,
        //     quantity: 1,
        //     price: productData?.price,
        //     thumb: productData?.thumb,
        //     title: productData?.title,
        // });
    }
    return (
        <div className='w-full'>
            <header className='font-semibold text-[24px] uppercase'>MY cart</header>
            <div className='flex flex-col border my-8 w-main mx-auto '>
                <div className='w-main mx-auto bg-gray-200 font-bold py-3 grid grid-cols-10'>
                    <span className='col-span-5 w-full text-center'>Products</span>
                    <span className='col-span-1 w-full text-center'>Quantity</span>
                    <span className='col-span-3 w-full text-center'>Price</span>
                    <span className='col-span-1 w-full text-center'>Action</span>
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
                        {formatMoney(totalPrice) + ' VND'}</span>
                </div>
                <span className='text-xs italic'>Shipping, taxes, and discounts calculated at checkout.</span>
                <div className='flex items-center gap-4'>
                    <Button handleOnClick={handleUpdateCart}>Update cart</Button>
                    <Button handleOnClick={handleSubmit}>Checkout</Button>
                </div>
            </div>
        </div >

    )
}

export default DetailCart
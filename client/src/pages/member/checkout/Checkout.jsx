import React, { useEffect, useState } from 'react';
import payment from '../../../assets/images/shopping.gif';
// import payment from '../../../assets/images/payment.svg';
import { useForm } from 'react-hook-form';
import { RiShoppingBagLine } from "react-icons/ri";
import { useSelector } from 'react-redux';
import { Button, InputHookForm } from '../../../components';
import Paypal from '../../../components/paypal/Paypal';
import { formatMoney } from '../../../ultils/helpers';
import { Link, useNavigate } from 'react-router-dom';
import path from '../../../ultils/path';
import { Congratulation } from '../../../components';
import { useDispatch } from "react-redux";
import { getCurrent } from '../../../store/user/userAction';
import { paymentMethod } from '../../../ultils/constants';
import { SlPaypal } from "react-icons/sl";
import Swal from 'sweetalert2';
import { apiCreateOrder } from '../../../apis';
const Checkout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentCart, current } = useSelector(state => state.user)
    const [isSucceed, setIsSucceed] = useState(false);
    const [checkoutWithPaypal, setCheckoutWithPaypal] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(paymentMethod[0]);

    //function to handle pay with COD
    const handlePayWithCOD = async () => {
        const response = await apiCreateOrder({
            products: currentCart,
            total: totalPrice,
            address: current?.address,
            paymentMethod: selectedPaymentMethod?.code,
        });
        if (response.status) {
            setIsSucceed(true)
            Swal.fire({
                icon: 'success',
                title: 'Order Success',
                text: 'Thank you for your order',
                confirmButtonText: 'Go to Home',
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate(`/${path.HOME}`)
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    navigate(`/${path.MEMBER}/${path.MY_ORDER}`)
                }
            })
        }
    }

    //if chosse cod, button paypal dispearance
    //else choose paypal, button cod dispearance
    useEffect(() => {
        console.log(selectedPaymentMethod?.code)
        if (selectedPaymentMethod?.code === 'COD') {
            setCheckoutWithPaypal(false);
        }
        if (selectedPaymentMethod?.code === 'PayPal') {
            setCheckoutWithPaypal(true);
        }
    }, [selectedPaymentMethod])

    useEffect(() => {
        if (isSucceed) {
            dispatch(getCurrent());
        }
    }, [isSucceed])
    // console.log(address)
    //define totalPrice 
    const totalPrice = currentCart?.reduce((sum, item) => sum + (Number(item?.price) * Number(item?.quantity)), 0);
    return (
        <div className='flex flex-col w-full'>
            {isSucceed && <Congratulation />}
            <div
                className='w-full flex justify-center items-center pb-10'>
                <img
                    onClick={() => navigate('/')}
                    src={payment} alt="payment" className='w-[260px] object-contain cursor-pointer' />
            </div>
            <Link
                to={`/${path.MEMBER}/${path.MY_CART}`}
                className='absolute top-[270px] left-[100px] text-sky-800 cursor-pointer hover:text-sky-500'>
                <RiShoppingBagLine size={24} />
            </Link>
            <div className='w-full gap-8 grid grid-cols-10 pl-20'>
                <div className='col-span-5 pr-8'>
                    <table className='table-auto w-full' >
                        <thead>
                            <tr className='border bg-gray-200'>
                                <th className='text-center p-2'>Product</th>
                                <th className='text-center p-2'>Quantity</th>
                                <th className='text-right p-2'>Price</th>
                            </tr>
                        </thead>
                        <tbody >
                            {currentCart?.map(item => (
                                <tr
                                    key={item?._id}
                                    className='border'>
                                    <td className='text-center p-2 flex justify-center items-center'>
                                        <img className='w-12 object-contain' src={item?.thumb} alt="thumb" />
                                        <span>{item?.title}</span>
                                    </td>
                                    <td className='text-center p-2   '>
                                        <span className='rounded-full bg-gray-600 text-white p-2 '>{item?.quantity}</span>
                                    </td>
                                    <td className='text-right p-2 '>{formatMoney(item?.price) + ' VND'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className='flex items-center justify-end gap-6 mt-8'>
                        <div className='flex items-center gap-6 text-sm'>
                            <span className='text-[16px] font-semibold'>Subtotal</span>
                            <span className='text-main text-[16px] font-bold'>
                                {formatMoney(totalPrice) + ' VND'}</span>
                        </div>
                    </div>
                </div>
                <div className='flex-4 col-span-5 w-full pr-20'>
                    <div className='pb-6'>
                        <span className='font-bold'>Address</span>
                        <span className='text-main font-semibold'>{`   ${current?.address}`}</span>
                    </div>
                    <div className='pb-6'>
                        <span className='font-bold'>Payment method </span>
                        {paymentMethod.map((method, index) => (
                            <div key={index}>
                                <div
                                    className='cursor-pointer flex items-center gap-4 border p-4 mb-2 hover:bg-gray-100'
                                    onClick={() => setSelectedPaymentMethod(method)}
                                >
                                    <div>
                                        <input
                                            className='form-radio w-5 h-5'
                                            type='radio'
                                            id={`paymentMethod-${index}`}
                                            name='paymentMethod'
                                            value={method.value}
                                            onChange={() => setSelectedPaymentMethod(method)}
                                            checked={selectedPaymentMethod === method}
                                        />
                                    </div>
                                    <div className='flex items-center gap-4'>
                                        <span className='font-bold text-[14px]'>
                                            {method?.value}
                                        </span>
                                        {method?.code === 'PayPal' && <SlPaypal size={24} color='blue' />}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {checkoutWithPaypal
                        ? <Paypal
                            setIsSucceed={setIsSucceed}
                            payload={{
                                products: currentCart,
                                total: totalPrice,
                                address: current?.address,
                                paymentMethod: selectedPaymentMethod?.code,
                                status: 'Succeeded'
                            }}
                            amount={Math.round(totalPrice / 24520)} />
                        :
                        <Button
                            style='bg-orange-500 hover:bg-orange-600 w-full h-12 rounded-md'
                            fullWidth
                            handleOnClick={() => handlePayWithCOD()}>
                            <span className='text-[16px] font-bold italic'>
                                Pay with COD
                            </span>
                        </Button>}

                </div>
            </div>
            {/* <div className='flex w-full flex-1 justify-center items-center flex-col gap-6'>
                <h2 className='text-2xl mb-6 font-bold '>
                    Checkout your cart
                </h2>
                <div className='flex w-full gap-6 justify-center items-center'>
                    <div>
                        <InputHookForm
                            label='Your Address'
                            register={register}
                            errors={errors}
                            id='address'
                            validate={{ required: 'Address is required' }}
                            fullwidth
                            placeholder='Enter your address here ...'
                            style='text-sm'
                        />
                        {address &&
                            <div className='w-full mt-8'>
                                <Paypal amount={Math.round(totalPrice / 24520)} />
                            </div>}
                    </div>
                    <div className='flex flex-1'>
                        <table className='table-fit'>
                            <thead>
                                <tr className='border bg-gray-200'>
                                    <th className='text-center p-2'>Product</th>
                                    <th className='text-center p-2'>Quantity</th>
                                    <th className='text-right p-2'>Price</th>
                                </tr>
                            </thead>
                            <tbody >
                                {currentCart?.map(item => (
                                    <tr
                                        key={item?._id}
                                        className='border'>
                                        <td className='text-center p-2 '>
                                            <img className='w-12 object-contain' src={item?.thumb} alt="thumb" />
                                            <span>{item?.title}</span>
                                        </td>
                                        <td className='text-center p-2   '>
                                            <span className='rounded-full bg-gray-600 text-white p-2 '>{item?.quantity}</span>
                                        </td>
                                        <td className='text-right p-2 '>{formatMoney(item?.price) + ' VND'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className='flex-1 flex flex-col justify-between'>
                            <div className='flex flex-col gap-6'>
                                <div className='flex items-center gap-6 text-sm'>
                                    <span className='text-[16px] font-semibold'>Subtotal:</span>
                                    <span className='text-main text-[16px] font-bold'>
                                        {formatMoney(totalPrice) + ' VND'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div> */}
        </div >
    )
}

export default Checkout
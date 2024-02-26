import React, { memo, useEffect, useState } from 'react'
import { formatMoney } from '../../ultils/helpers';
import moment from 'moment';
import clsx from 'clsx';
import { RiEdit2Line } from "react-icons/ri";
import SelectHookForm from '../inputs/SelectHookForm';
import { useForm } from 'react-hook-form';
import { statusOrder } from '../../ultils/constants';
import { apiUpdateStatusOrder } from '../../apis';
import { toast } from 'react-toastify';
import Button from '../buttons/Button';
const OrderDetail = ({ orderDetail, setOrderDetail, isAdmin }) => {
    const userInformation = orderDetail?.orderBy;
    const productInformation = orderDetail?.products;
    const [editStatus, setEditStatus] = useState(false);
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const updateStatusOrder = async (data) => {
        // console.log(data)
        try {
            const response = await apiUpdateStatusOrder(orderDetail?._id, data);
            if (response?.status) {
                toast.success('Update order successfully');
                reset();
                setOrderDetail(response?.order)
                setEditStatus(false);
                // Reset form và làm các công việc khác sau khi submit thành công
            } else {
                toast.error('Update order failed');
            }
        } catch (error) {
            console.error('API error:', error.message);
        }
    }

    return (
        <div className='w-full flex flex-col gap-4 relative'>
            <form onSubmit={handleSubmit(updateStatusOrder)}>
                <div className='h-[69px] w-full '></div>
                <div className='p-4 bg-gray-100 fixed top-0 flex justify-between right-0 left-[266px] items-center'>
                    <h1 className='text-3xl font-bold tracking-tight'>
                        Order Detail
                    </h1>
                    <span
                        className='text-main cursor-pointer'
                        onClick={() => setOrderDetail(null)}>Back</span>
                </div>
                <div className={clsx(isAdmin ? 'grid grid-cols-10' : 'w-full')}>
                    {isAdmin && <div className='col-span-4 p-6 border-r border-r-blue-300'>
                        <h3 className='font-bold text-center text-[20px]'>User Information</h3>
                        <div className='flex flex-col gap-4 p-6'>
                            <span className='font-semibold'>Full Name:
                                <span className='text-orange-800'>{` ${userInformation?.firstName} ${userInformation?.lastName}`}</span>
                            </span>
                            <span className='font-semibold'>Email:
                                <span className='text-orange-800'>{` ${userInformation.email}`}</span>
                            </span>
                            <span className='font-semibold'>Mobile:
                                <span className='text-orange-800'>{` ${userInformation.mobile}`}</span>
                            </span>
                            <span className='font-semibold'>Address:
                                <span className='text-orange-800'>{` ${userInformation.address}`}</span>
                            </span>
                        </div>
                    </div>}
                    <div className={clsx(isAdmin ? 'col-span-6 p-6' : 'w-full')}>
                        <h3 className='font-bold text-center text-[20px]'>Order Information</h3>
                        {/* <div className='flex flex-col gap-4 p-6'>
                        <div className='flex flex-col gap-2 border-b border-blue-500'>
                            {productInformation?.map((product, index) => (
                                <div className='flex gap-2 items-center border-b border-blue-100'>
                                    <img src={product?.thumb} alt="thumb" className='w-12 h-12 object-contain border' />
                                    <span className='text-sm'>{product?.title}</span>
                                    <span className='text-sm'>{product?.color}</span>
                                    <span className='text-sm'>{`${formatMoney(product?.price)} VND`}</span>
                                    <span className='text-sm'>{`x${product?.quantity}`}</span>
                                </div>
                            ))}
                        </div>
                        <span className='font-bold'>Total:
                            <span className='text-orange-800'>{` ${formatMoney(orderDetail?.total)} VND`}</span>
                        </span>
                        <span className='font-bold'>Status:
                            <span className='text-orange-800'>{` ${orderDetail?.status}`}</span>
                        </span>
                        <span className='font-bold'>Created At:
                            <span className='text-orange-800'>{` ${moment(orderDetail?.createdAt).format('DD/MM/YYYY')}`}</span>
                        </span>
                    </div> */}
                        <table className='table-auto w-full border-b border-black'>
                            <thead className='p-6 border-b border-black'>
                                <tr>
                                    <th>Product</th>
                                    <th>Color</th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productInformation?.map((product, index) => (
                                    <tr key={index}>
                                        <td className='flex items-center gap-2'>
                                            <img src={product?.thumb} alt="thumb" className='w-12 h-12 object-contain border' />
                                            <span className='flex flex-col'>
                                                <span>
                                                    <span className='text-[14px]'>{product?.title}</span>
                                                </span>
                                            </span>
                                        </td>
                                        <td className='text-center'>
                                            <span className='text-[14px]'>{product?.color}</span>
                                        </td>


                                        <td className='text-center'>
                                            <span className='text-[14px]'>{` x${product?.quantity}`}</span>

                                        </td>
                                        <td className='text-center'>
                                            <span className='text-orange-800 text-[14px]'>{` ${formatMoney(product?.price)} VND`}</span>
                                        </td>

                                        {/* <td className='text-center'>
                                    </td> */}
                                        {/* <td className='text-center'>
                                        
                                    </td> */}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className='flex flex-col gap-2 mt-6'>
                            <span className='flex items-center gap-4'>
                                <span className='font-bold'>Status:</span>
                                {editStatus
                                    ? <span className='w-[120px]'>
                                        <SelectHookForm
                                            options={statusOrder?.map(item => (
                                                { code: item.label, value: item?.value }
                                            ))}
                                            register={register}
                                            id='status'
                                            errors={errors}
                                            style='h-[50px] pt-0 text-[14px]'
                                            defaultValue={orderDetail?.status}
                                        />
                                    </span>
                                    : <span className='text-orange-800 text-[14px]'>{` ${orderDetail?.status}`}</span>
                                }

                                {isAdmin && <span className='cursor-pointer hover:text-main'
                                    onClick={() => setEditStatus(!editStatus)}>
                                    <RiEdit2Line size={20} />
                                </span>}
                            </span>
                            <span className='flex items-center gap-4'>
                                <span className='font-bold'>Payment method: </span>
                                <span className='text-orange-800 text-[14px] text-center'>
                                    {` ${orderDetail?.paymentMethod}`}
                                </span>
                            </span>
                            <span className='flex items-center gap-4'>
                                <span className='font-bold'>Order date:</span>
                                <span className='text-orange-800 text-[14px] text-center'>
                                    {` ${moment(orderDetail?.createdAt).format('DD/MM/YYYY')}`}
                                </span>
                            </span>
                            {isAdmin && <span>
                                <Button type='submit'>
                                    Update
                                </Button>
                            </span>}
                        </div>
                    </div>
                </div>
            </form>

        </div >
    )
}

export default memo(OrderDetail)
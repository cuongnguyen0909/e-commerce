import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { createSearchParams, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { InputHookForm, OrderDetail, Pagination, ReactSelect } from '../../../components';
import moment from 'moment';
import { formatMoney } from '../../../ultils/helpers';
import { apiGetOrdersByAdmin } from '../../../apis';
import { statusOrder } from '../../../ultils/constants';
import { CiRead } from 'react-icons/ci';

const ManageOrder = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [orders, setOrders] = useState(null);
    const [orderDetail, setOrderDetail] = useState(null);
    const { register, formState: { errors }, watch } = useForm()
    const [params] = useSearchParams();
    const q = watch('q');
    // console.log(orderDetail)
    const status = watch('status');
    const fetchOrders = async (params) => {
        const response = await apiGetOrdersByAdmin({
            ...params,
            limit: 5
        });
        console.log(response)
        if (response.status) {
            setOrders(response)
        }
    }
    useEffect(() => {
        const pr = Object.fromEntries([...params])
        fetchOrders(pr);
    }, [params, orderDetail])

    const handleSearchStatus = ({ value }) => {
        navigate({
            pathname: location.pathname,
            search: createSearchParams({ status: value }).toString()
        })
    }
    return (
        <div className='w-full flex flex-col gap-4 relative'>
            {orderDetail &&
                <div className='absolute inset-0 min-h-screen bg-gray-100 z-50'>
                    <OrderDetail
                        orderDetail={orderDetail}
                        setOrderDetail={setOrderDetail}
                        isAdmin
                    />
                </div>}
            <header className='text-3xl font-bold tracking-tight border-b border-b-blue-200'>
                Purchase History
            </header>

            <div className='flex w-full justify-end items-center'>
                <form className='w-[45%] flex justify-center gap-4'>
                    <div className='flex-1'>
                        <InputHookForm
                            id='q'
                            register={register}
                            errors={errors}
                            fullwidth
                            placeholder='Search something...'
                        />
                    </div>
                    <div className='flex-1'>
                        <ReactSelect
                            option={statusOrder}
                            value={status}
                            onChange={value => handleSearchStatus(value)}
                            wrapClassName='w-full' />
                    </div>
                </form>
            </div>
            <table className='table-auto w-full'>
                <thead className='text-center text-[16px] text-white'>
                    <tr className=' bg-sky-700'>
                        <th className='py-2'>#</th>
                        <th className='py-2'>Product</th>
                        <th className='py-2'>Total</th>
                        <th className='py-2'>Status</th>
                        <th className='py-2'>Created At</th>
                        <th className='py-2'>Action</th>
                    </tr>
                </thead>
                <tbody className='text-[14px] text-center'>
                    {orders?.orders?.map((item, index) => (
                        <tr className='border-b border-blue-200'
                            key={item._id}>
                            <td className='text-center '>
                                {((params.get('page') > 1 ? params.get('page') - 1 : 0) * process.env.REACt_APP_LIMIT) + (index + 1)}</td>
                            <td className='text-center grid grid-cols-2 gap-4 p-4 border'>
                                {item?.products?.map((product, index) => (
                                    <span
                                        className='flex justify-start items-center gap-4 text-[14px] '>
                                        <img src={product?.thumb} alt="thumbnail" className='w-8 h-8 rounded-md object-contain' />
                                        <span className='flex flex-col items-start'>
                                            <span>
                                                <span className='text-main font-bold'>{product?.title}</span>
                                                <span className='border rounded-md text-[11px] bg-gray-600 text-white ml-1'>
                                                    <span className='p-1 font-bold text-[12px]'>
                                                        {` x${product?.quantity}`}
                                                    </span>
                                                </span>
                                            </span>
                                            <span className='text-[12px] font-semibold italic'>
                                                <span>{product?.color}</span>
                                                <span>{` - ${formatMoney(product?.price)} VND`}</span>
                                            </span>
                                        </span>
                                    </span>
                                ))}
                            </td>
                            <td className='font-medium'>{`${formatMoney(item?.total)} VND`}</td>
                            <td className='font-medium'>{item?.status}</td>
                            <td className='font-medium'>{moment(item?.createdAt).format('DD/MM/YYYY')}</td>
                            <td className='text-center'>
                                <span
                                    className='text-blue-500 hover:underline hover:text-orange-500 inline-block cursor-pointer px-1'
                                    onClick={() => setOrderDetail(item)}>
                                    <CiRead title='Order detail' size={20} />
                                </span>

                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className='flex justify-end'>
                <Pagination totalCount={orders?.total} />
            </div>
        </div >
    )
}

export default ManageOrder
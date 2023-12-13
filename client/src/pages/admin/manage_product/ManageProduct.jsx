import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom';
import { InputHookForm, Pagination } from '../../../components';
import { useForm } from 'react-hook-form';
import { apiGetProducts } from '../../../apis';
import moment from 'moment';
const ManageProduct = () => {
    const { register, formState: { errors }, handleSubmit, reset } = useForm();
    const handleSearchProdcut = (data) => {
        console.log(data)
    }
    const [params] = useSearchParams();
    const [products, setProducts] = useState(null)
    const fetchProducts = async (queries) => {
        const response = await apiGetProducts({ ...queries, limit: process.env.REACt_APP_LIMIT });
        // console.log(response)
        if (response.status) {
            setProducts(response)
        }
    }
    const queries = Object.fromEntries([...params])
    useEffect(() => {
        // console.log(products)
        fetchProducts(queries)
    }, [params])

    return (
        <div>
            <div className='w-full flex flex-col gap-4 relative'>
                <div className='h-[69px] w-full '></div>
                <div className='p-4 bg-gray-100 w-full fixed top-0 flex justify-between items-center'>
                    <h1 className='text-3xl font-bold tracking-tight'>
                        Manage Product
                    </h1>
                </div>
                <div className='flex w-full justify-end items-center'>
                    <form className='w-[45%]' onSubmit={handleSubmit(handleSearchProdcut)}>
                        <InputHookForm
                            id='query'
                            register={register}
                            errors={errors}
                            fullwidth
                            placeholder='Search something...'

                        />
                    </form>
                </div>
                <table className='table-auto '>
                    <thead className='text-center'>
                        <tr className=' bg-sky-600'>
                            <th className='py-2'>#</th>
                            <th className='py-2'>Thumbnail</th>
                            <th className='py-2'>Title</th>
                            <th className='py-2'>Brand</th>
                            <th className='py-2'>Category</th>
                            <th className='py-2'>Price</th>
                            <th className='py-2'>Quantity</th>
                            <th className='py-2'>Sold</th>
                            <th className='py-2'>Color</th>
                            <th className='py-2'>Rating</th>
                            <th className='py-2'>Updated At</th>
                        </tr>
                    </thead>
                    <tbody >
                        {products?.products?.map((item, index) => (
                            <tr key={item._id}>
                                <td className='text-center border-b border-sky-200'>{index + 1}</td>
                                <td className='text-center border-b border-sky-200'>
                                    <img src={item?.thumb} alt="thumbnail" className='w-12 h-12 object-cover' />
                                </td>
                                <td className='text-center border-b border-sky-200'>{item?.title}</td>
                                <td className='text-center border-b border-sky-200'>{item?.brand}</td>
                                <td className='text-center border-b border-sky-200'>{item?.category}</td>
                                <td className='text-center border-b border-sky-200'>{item?.price}</td>
                                <td className='text-center border-b border-sky-200'>{item?.quantity}</td>
                                <td className='text-center border-b border-sky-200'>{item?.sold}</td>
                                <td className='text-center border-b border-sky-200'>{item?.color}</td>
                                <td className='text-center border-b border-sky-200'>{item?.totalRatings}</td>
                                <td className='text-center border-b border-sky-200'>{moment(item?.updatedAt).format('DD/MM/YYYY')}</td>

                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className='flex justify-end'>
                    <Pagination totalCount={products?.total} />
                </div>
            </div>
        </div>
    )
}

export default ManageProduct
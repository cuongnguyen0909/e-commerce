import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { createSearchParams, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { apiGetProducts, apiDeleteProduct } from '../../../apis';
import { InputHookForm, Pagination } from '../../../components';
import CustomVarriant from './CustomVarriant';
import useDebounce from '../../../custom_hook/useDebounce';
import UpdateProduct from './UpdateProduct';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify'
import { FaRegPenToSquare } from "react-icons/fa6";
import { IoIosRemoveCircle } from "react-icons/io";
import { BiCustomize } from "react-icons/bi";

const ManageProduct = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { register, formState: { errors }, watch } = useForm();
    const [params] = useSearchParams();
    const [products, setProducts] = useState(null)

    const [editProduct, setEditProduct] = useState(null);
    const [updateProduct, setUpdateProduct] = useState(false);
    const [customVarriant, setCustomVarriant] = useState(null)

    const render = () => {
        setUpdateProduct(!updateProduct)
    }
    const fetchProducts = async (prams) => {
        const response = await apiGetProducts({ ...prams, limit: process.env.REACt_APP_LIMIT });
        // console.log(response)
        if (response.status) {
            setProducts(response)
        }
    }

    const searchDebounce = useDebounce(watch('query'), 1000);
    useEffect(() => {
        if (searchDebounce) {
            navigate({
                pathname: location.pathname,
                search: createSearchParams({ query: searchDebounce }).toString()
            })
        } else {
            navigate({
                pathname: location.pathname
            })
        }
    }, [searchDebounce])
    useEffect(() => {
        const searchParams = Object.fromEntries([...params])

        // console.log(products)
        fetchProducts(searchParams)
    }, [params, updateProduct])

    const handleDeleteProduct = async (pid) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover this product!',
            icon: 'warning',
            showCancelButton: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                const repspone = await apiDeleteProduct(pid);
                if (repspone.status) {
                    toast.success('Delete product successfully')
                } else {
                    {
                        toast.error('Delete product failed')
                    }
                }
                render();
            }
        })
    }
    return (
        <div>
            <div className='w-full flex flex-col gap-4 relative'>
                {editProduct &&
                    <div className='absolute inset-0 min-h-screen bg-gray-100 z-50'>
                        <UpdateProduct
                            editProduct={editProduct}
                            render={render}
                            setEditProduct={setEditProduct} />
                    </div>}
                {customVarriant &&
                    <div className='absolute inset-0 min-h-screen bg-gray-100 z-50'>
                        <CustomVarriant
                            customVarriant={customVarriant}
                            render={render}
                            setCustomVarriant={setCustomVarriant} />
                    </div>}
                <div className='h-[69px] w-full '></div>
                <div className='p-4 bg-gray-100 w-full fixed top-0 flex justify-between items-center'>
                    <h1 className='text-3xl font-bold tracking-tight'>
                        Manage Product
                    </h1>
                </div>
                <div className='flex w-full justify-end items-center'>
                    <form className='w-[45%]'>
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
                    <thead className='text-center text-[16px]'>
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
                            <th className='py-2'>Varriants</th>
                            <th className='py-2'>Action</th>
                            <th className='py-2'>Updated At</th>
                        </tr>
                    </thead>
                    <tbody className='text-[14px]'>
                        {products?.products?.map((item, index) => (
                            <tr key={item._id}>
                                <td className='text-center border-b border-sky-200'>
                                    {((params.get('page') > 1 ? params.get('page') - 1 : 0) * process.env.REACt_APP_LIMIT) + (index + 1)}</td>
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
                                <td className='text-center border-b border-sky-200'>{item?.varriants?.length || 0}</td>
                                <td className='text-center border-b border-sky-200'>{moment(item?.updatedAt).format('DD/MM/YYYY')}</td>
                                <td className='text-center border-b border-sky-200'>
                                    <span
                                        className='text-blue-500 hover:underline hover:text-orange-500 inline-block cursor-pointer px-1'
                                        onClick={() => setEditProduct(item)}>
                                        <FaRegPenToSquare size={20} />
                                    </span>
                                    <span
                                        className='text-blue-500 hover:underline hover:text-orange-500 inline-block cursor-pointer px-1'
                                        onClick={() => handleDeleteProduct(item._id)}>
                                        <IoIosRemoveCircle size={20} />
                                    </span>
                                    <span
                                        className='text-blue-500 hover:underline hover:text-orange-500 inline-block cursor-pointer px-1'
                                        onClick={() => { setCustomVarriant(item) }}>
                                        <BiCustomize size={20} />
                                    </span>
                                </td>

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
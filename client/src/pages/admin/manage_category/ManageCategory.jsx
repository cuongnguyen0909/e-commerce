import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AiFillEdit } from "react-icons/ai";
import { RiDeleteBin6Line } from "react-icons/ri";
import { TiCancel } from "react-icons/ti";
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { apiGetCategories } from '../../../apis';
import { apiCreateCategory, apiDeleteBrand, apiDeleteCategory } from '../../../apis/category';
import { Button, InputHookForm, SelectHookForm } from '../../../components';



const ManageCategory = () => {
    const [categories, setCategories] = useState(null)
    const { register, handleSubmit, formState: { errors }, watch, reset } = useForm();
    const [editCategory, setEditCategory] = useState(null);
    const [editBrand, setEditBrand] = useState(null);
    const [formReset, setFormReset] = useState(false);

    const fetchCategories = async () => {
        const response = await apiGetCategories();
        if (response?.status) {
            setCategories(response?.proCategories)
        }
    }
    const onSubmit = async (data) => {
        console.log(data)
        try {
            const response = await apiCreateCategory(data);
            if (response?.status) {
                toast.success('Create category successfully');
                reset();
                setFormReset(prev => !prev);
                setEditCategory(false);
                setEditBrand(false);
                // Reset form và làm các công việc khác sau khi submit thành công
            } else {
                toast.error('Create category failed');
            }
        } catch (error) {
            console.error('API error:', error.message);
        }
    };
    // console.log(categories)
    // console.log(watch('title'))
    // console.log(watch('brand'))
    useEffect(() => {
        fetchCategories();
    }, [formReset])

    const handleDeleteCategory = (title) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover this product!',
            icon: 'warning',
            showCancelButton: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                const repspone = await apiDeleteCategory(title);
                if (repspone.status) {
                    toast.success('Delete category successfully')
                } else {
                    {
                        toast.error('Delete category failed')
                    }
                }
            }
            reset();
            setFormReset(prev => !prev);
            setEditCategory(false);
            setEditBrand(false);
        })
    }
    const handleDeleteBrand = (title, brand) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover this brand!',
            icon: 'warning',
            showCancelButton: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                const repspone = await apiDeleteBrand(title, brand);
                if (repspone.status) {
                    toast.success('Delete brand successfully')
                } else {
                    {
                        toast.error('Delete brand failed')
                    }
                }
            }
            reset();
            setFormReset(prev => !prev);
            setEditCategory(false);
            setEditBrand(false);
        })
    }

    return (
        <div className='w-full relative flex flex-col items-center'>
            <h1 className='h-[75px] flex justify-between items-center text-3xl font-bold px-4 border-b'>
                <span>Manage Category</span>
            </h1>
            <div className='w-[700px] relative'>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <span
                        className='absolute top-o cursor-pointer right-0 text-main hover:text-orange-400'
                        onClick={() => handleDeleteCategory(watch('title'))}>
                        <RiDeleteBin6Line size={24} />
                    </span>
                    {editCategory
                        ? <span className='absolute top-o cursor-pointer right-[50px] text-[#7BD3EA] hover:text-sky-600'
                            onClick={() => setEditCategory(false)}>
                            <TiCancel size={24} />
                        </span>
                        : <span className='absolute top-o cursor-pointer right-[50px] text-[#7BD3EA] hover:text-sky-600'
                            onClick={() => setEditCategory(true)}>
                            <AiFillEdit size={24} />
                        </span>}
                    <span className='absolute top-[120px] cursor-pointer right-0 text-main hover:text-orange-400'
                        onClick={() => handleDeleteBrand(watch('title'), watch('brand'))}>
                        < RiDeleteBin6Line size={24} />
                    </span>
                    {editBrand
                        ? <span className='absolute top-[120px] cursor-pointer right-[50px] text-[#7BD3EA] hover:text-sky-600'
                            onClick={() => setEditBrand(false)}>
                            <TiCancel size={24} />
                        </span>
                        : <span className='absolute top-[120px] cursor-pointer right-[50px] text-[#7BD3EA] hover:text-sky-600'
                            onClick={() => setEditBrand(true)}>
                            <AiFillEdit size={24} />
                        </span>}
                    <div>
                        <div className='w-full my-6 gap-4 flex flex-col '>
                            {editCategory
                                ? <InputHookForm
                                    label='Category'
                                    register={register}
                                    errors={errors}
                                    id='title'
                                    validate={{ required: 'Category is required' }}
                                    fullwidth
                                />
                                : <SelectHookForm
                                    label='Category'
                                    options={categories?.map(item => ({ code: item.title, value: item?.title }))}
                                    register={register}
                                    id='title'
                                    errors={errors}
                                    fullwidth
                                    addNew
                                />}
                            {editBrand
                                ? <InputHookForm
                                    label='Brand'
                                    register={register}
                                    errors={errors}
                                    id='brand'
                                    validate={{ required: 'Brand is required' }}
                                    style='flex-1'
                                    fullwidth
                                />
                                : <SelectHookForm
                                    label='Brand'
                                    options={
                                        categories?.find(item => item?.title === watch('title'))?.brand?.map(itemB =>
                                            ({ code: itemB, value: itemB }))}
                                    register={register}
                                    id='brand'
                                    errors={errors}
                                    style='flex-1'
                                    fullwidth
                                    addNew
                                />}
                        </div>
                    </div>
                    <div className='flex justify-end'>
                        {/* <span
                        className='underline cursor-pointer text-main'
                        onClick={() => setCreateCategory(true)}>
                        Create new category
                    </span> */}
                        <div className='mt-8'>
                            <Button type='submit'>
                                Submit
                            </Button>
                        </div>
                    </div>
                </form>


            </div>
        </div >
    )
}

export default ManageCategory
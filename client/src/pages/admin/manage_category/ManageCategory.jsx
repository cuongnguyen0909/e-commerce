import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { SelectHookForm } from '../../../components';
import { getBase64 } from '../../../ultils/helpers';
import { apiGetCategories } from '../../../apis';

const ManageCategory = () => {
    const [categories, setCategories] = useState(null)
    const { register, handleSubmit, formState: { errors }, watch, reset } = useForm();
    const [preview, setPreview] = useState({
        image: null,
    })
    const fetchCategories = async () => {
        const response = await apiGetCategories();
        if (response.status) {
            setCategories(response.proCategories)
        }
    }
    const handlePreviewImage = async (file) => {
        try {
            if (file) {
                const toBase64Thumb = await getBase64(file);
                setPreview(prev => ({ ...prev, thumb: toBase64Thumb }));
            } else {
                // Handle the case where the file is empty or undefined
                setPreview(prev => ({ ...prev, thumb: null }));
            }
        } catch (error) {
            console.error("Error while processing thumbnail:", error);
            // Handle the error as needed
        }
    }
    console.log(categories)

    useEffect(() => {
        // console.log(watch('thumb'));
        if (watch('image')) {
            handlePreviewImage(watch('image'));
        }
        setPreview({
            image: categories?.image,
        })
        fetchCategories();
    }, [watch('image')])

    return (
        <div className='w-full'>
            <h1 className='h-[75px] flex justify-between items-center text-3xl font-bold px-4 border'>
                <span>Manage Category</span>
            </h1>
            <div className='w-full'>
                <form >
                    <div className='w-full my-6 flex gap-4'>
                        <SelectHookForm
                            label='Category'
                            options={categories?.map(item => ({ code: item._id, value: item?.title }))}
                            register={register}
                            id='category'
                            errors={errors}
                            validate={{ required: 'Category is required' }}
                            style='flex-auto'
                            fullwidth
                        />
                        <SelectHookForm
                            label='Brand (Optional)'
                            options={
                                categories?.find(item => item?._id === watch('category'))?.brand?.map(itemB =>
                                    ({ code: itemB.toLowerCase(), value: itemB }))}
                            register={register}
                            id='brand'
                            errors={errors}
                            // validate={{ required: 'Brand is required' }}
                            style='flex-auto'
                            fullwidth
                        />
                    </div>
                    <div className='flex flex-col gap-2 mt-8 border-b'>
                        {categories?.map(item => item._id === watch('category') && (

                            <img src={item?.image} alt="thumbnail" className='w-[200px] object-contain' />
                        ))}
                        {
                            errors['image'] && (
                                <small className="text-xs text-red-500">{errors['image']?.message}</small>
                            )
                        }
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ManageCategory
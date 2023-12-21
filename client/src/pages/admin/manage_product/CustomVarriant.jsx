import React, { memo, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { InputHookForm, Loading } from '../../../components';
import { Button } from '../../../components';
import { getBase64 } from '../../../ultils/helpers';
import { toast } from 'react-toastify';
import { apiAddVarriant } from '../../../apis';
import Swal from 'sweetalert2';
import { showModal } from '../../../store/app/appSlice';
import { useDispatch } from 'react-redux';

const CustomVarriant = ({ customVarriant, setCustomVarriant, render }) => {
    const dispatch = useDispatch();
    const { register, handleSubmit, formState: { errors }, watch, reset } = useForm();
    const [preview, setPreview] = useState({
        thumb: null,
        images: []
    })

    const handlePreviewThumb = async (file) => {
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

    const handlePreviewImages = async (files) => {
        const imagesPreview = [];
        try {
            for (let file of files) {
                if (file.type !== 'image/png'
                    && file.type !== 'image/jpeg'
                    && file.type !== 'image/jpg'
                    && file.type !== 'image/webp') {
                    toast.warning('Only support png, jpeg, jpg, webp!');
                    continue;
                }
                const toBase64ImagesProduct = await getBase64(file);
                imagesPreview.push(toBase64ImagesProduct);
            }
        } catch (error) { }
        setPreview(prev => ({ ...prev, images: imagesPreview }));
    }
    const sumQuantityOfVarriants = () => {
        return customVarriant?.quantity - customVarriant?.varriants?.reduce((total, item) => total + item.quantity, 0);
    }
    useEffect(() => {
        // console.log(watch('thumb'));
        if (watch('thumb') instanceof FileList && watch('thumb').length > 0) {
            handlePreviewThumb(watch('thumb')[0]);
        }
    }, [watch('thumb')])
    useEffect(() => {
        if (watch('images') instanceof FileList && watch('images').length > 0) {
            handlePreviewImages(watch('images'));
        }
    }, [watch('images')])

    const handleAddVarriant = async (data) => {
        if (data.color === customVarriant?.color || customVarriant?.varriants?.find(item => item.color === data.color)) {
            Swal.fire('Oops', 'Color is exist', 'info')
        } else {
            const formData = new FormData();
            for (let i of Object.entries(data)) {
                formData.append(i[0], i[1])
            }
            if (data.thumb) {
                formData.append('thumb', data.thumb[0])
            }
            if (data.images) {
                for (let image of data.images) {
                    formData.append('images', image)
                }
            }
            //using dispatch to show loading when create product
            dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }))
            const response = await apiAddVarriant(formData, customVarriant?._id);
            dispatch(showModal({ isShowModal: false, modalChildren: null }))
            if (response.status) {
                window.scrollTo(0, 0);
                toast.success('Add varriant successfully!');
                reset();
                setPreview({
                    thumb: '',
                    images: []
                })
            } else {
                toast.error('Add rarriant failed!');
            }
        }
        console.log(sumQuantityOfVarriants())
    }
    useEffect(() => {
        reset({
            title: customVarriant?.title,
            color: customVarriant?.color,
            price: customVarriant?.price,
            quantity: customVarriant?.quantity,
        })
        console.log(customVarriant)
    }, [customVarriant])
    return (
        <div
            className='w-full flex flex-col gap-4 relative'>
            <div className='h-[69px] w-full '></div>
            <div className='p-4 bg-gray-100 fixed top-0 flex justify-between right-0 left-[266px] items-center'>
                <h1 className='text-3xl font-bold tracking-tight'>
                    Custom Varriant
                </h1>
                <span
                    className='text-main cursor-pointer'
                    onClick={() => setCustomVarriant(null)}>Back</span>
            </div>
            <form onSubmit={handleSubmit(handleAddVarriant)} className='p-4 w-full flex flex-col gap-4'>
                <div className='flex gap-4 items-center w-full'>
                    <InputHookForm
                        label='Name varriant'
                        id='title'
                        register={register}
                        errors={errors}
                        style='flex-4'
                        validate={{ required: 'Title is required' }}
                        placeholder='Title of varriant'
                    />

                </div>
                <div className='flex gap-4 items-center w-full'>
                    <InputHookForm
                        label='Price varriant'
                        register={register}
                        errors={errors}
                        id='price'
                        validate={{ required: 'Price is required' }}
                        placeholder='Price varriant'
                        type='number'
                        style='flex-1'
                    />
                    <InputHookForm
                        label='Color varriant'
                        register={register}
                        errors={errors}
                        id='color'
                        validate={{
                            required: 'Color is required',
                        }}
                        placeholder='Color varriant'
                        style='flex-1'
                    />
                    <InputHookForm
                        label='Quantity varriant'
                        register={register}
                        errors={errors}
                        id='quantity'
                        validate={{
                            required: 'Quantity is required',
                            min: { value: 1, message: 'Quantity must be greater than 0' },
                            max: {
                                value: customVarriant?.quantity - customVarriant?.varriants?.reduce((total, item) =>
                                    total + item.quantity, 0),
                                message: `Quantity must be less than 
                                ${customVarriant?.quantity - customVarriant?.varriants?.reduce((total, item) =>
                                    total + item.quantity, 0)}`
                            }
                        }}
                        placeholder='Quantity varriant'
                        style='flex-1'
                    />
                </div>
                <div className='flex flex-col gap-2 mt-8 border-b'>
                    <label className='font-semibold' htmlFor="thumb">Upload thumbnail</label>
                    <div className='flex'>
                        <input
                            type="file"
                            id="thumb"
                            {...register('thumb', { required: 'Thumbnail is required' })}
                        />
                        {!preview.thumb &&
                            <span className='text-xs italic ml-[-120px] text-main'>*.jpg/jpeg/png/webp
                            </span>}
                    </div>
                    {
                        errors['thumb'] && (
                            <small className="text-xs text-red-500">{errors['thumb']?.message}</small>
                        )
                    }
                </div>
                {preview.thumb && <div className='my-4 '>
                    <div
                        className='w-fit ' >
                        <img src={preview.thumb} alt="thumbnail" className='w-[200px] object-contain' />
                    </div>
                </div>}
                <div className='flex flex-col gap-2 mt-8 border-b'>
                    <label className='font-semibold' htmlFor="images">Upload images for Product</label>
                    <div className='flex'>
                        <input
                            type="file"
                            id="images"
                            multiple
                            {...register('images', { required: 'Product images is required' })} />
                        {!preview.images.length > 0 &&
                            <span className='text-xs italic ml-[-120px] text-main'>*.jpg/jpeg/png/webp  </span>}
                    </div>
                    {
                        errors['images'] && (
                            <small className="text-xs text-red-500">{errors['images']?.message}</small>
                        )
                    }
                </div>
                {preview.images.length > 0 &&
                    <div
                        className='my-4 flex w-full gap-3 flex-wrap'>
                        {preview.images?.map((item, index) => (
                            <div
                                className='w-fit'
                                key={index}
                            >
                                <img src={item} alt="imageProduct" className='w-[200px] object-contain' />
                            </div>
                        ))}
                    </div>}
                <div className='mt-8'>
                    <Button type='submit'>
                        Add varriant
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default memo(CustomVarriant)
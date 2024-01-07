import React, { useCallback, useEffect, useState } from 'react';
import { InputHookForm, SelectHookForm, Button, MarkdownEditor, Loading } from '../../../components';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { validate, getBase64 } from '../../../ultils/helpers';
import { toast } from 'react-toastify';
import { apiCreateProduct } from '../../../apis';
import { showModal } from '../../../store/app/appSlice';

const CreateProduct = () => {
    const dispatch = useDispatch();
    const { categories } = useSelector(state => state.app);
    const { register, formState: { errors }, reset, handleSubmit, watch } = useForm();
    const [payload, setPayload] = useState({
        description: ''
    })

    const [preview, setPreview] = useState({
        thumb: null,
        images: []
    })
    const [invalidFields, setInvalidFields] = useState([]);

    const changeValue = useCallback((value) => {
        setPayload(value)
    }, [payload])

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
                imagesPreview.push({ name: file.name, path: toBase64ImagesProduct });
            }
        } catch (error) { }
        setPreview(prev => ({ ...prev, images: imagesPreview }));
    }
    useEffect(() => {
        // console.log(watch('thumb'));
        handlePreviewThumb(watch('thumb')[0]);
    }, [watch('thumb')])
    useEffect(() => {
        handlePreviewImages(watch('images'));
    }, [watch('images')])

    //define function handleCreateProduct to create new product 
    const handleCreateProduct = async (data) => {
        const invalid = validate(payload, setInvalidFields);
        if (invalid === 0) {
            if (data.category) {
                data.category = categories?.find(item => item._id === data.category)?.title;
                const finalPayload = { ...data, ...payload };
                console.log(finalPayload)
                // console.log({ ...data, ...payload })
                const formData = new FormData();
                for (let i of Object.entries(finalPayload)) {
                    formData.append(i[0], i[1])
                }
                if (finalPayload.thumb) {
                    formData.append('thumb', finalPayload.thumb[0])
                }
                if (finalPayload.images) {
                    for (let image of finalPayload.images) {
                        formData.append('images', image)
                    }
                }

                //using dispatch to show loading when create product
                dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }))
                const response = await apiCreateProduct(formData);
                dispatch(showModal({ isShowModal: false, modalChildren: null }))
                if (response.status) {
                    window.scrollTo(0, 0);
                    toast.success('Create product successfully!');
                    reset();
                    setPayload({ description: '' });
                } else {
                    toast.error('Create product failed!');
                }
                // console.log(response)
            }
        }
    }

    // console.log(invalidFields)
    // console.log(categories)
    // console.log('watch', watch('category'))
    return (
        <div className='w-full'>
            <h1 className='h-[75px] flex justify-between items-center text-3xl font-bold px-4 border'>
                <span>Create New Product</span>
            </h1>
            <div className='p-4'>
                <form onSubmit={handleSubmit(handleCreateProduct)}>
                    <InputHookForm
                        label='Name of Product'
                        register={register}
                        errors={errors}
                        id='title'
                        validate={{ required: 'Title is required' }}
                        fullwidth
                        placeholder='Name of new Product'
                    />
                    <div className='w-full flex my-6 gap-4'>
                        <InputHookForm
                            label='Price'
                            register={register}
                            errors={errors}
                            id='price'
                            validate={{ required: 'Price is required' }}
                            style='flex-1'
                            placeholder='Price of new Product'
                            type='number'
                            fullwidth
                        />
                        <InputHookForm
                            label='Quantity'
                            register={register}
                            style='flex-1'
                            errors={errors}
                            id='quantity'
                            validate={{ required: 'Quantity is required' }}
                            placeholder='Quantity of new Product'
                            type='number'
                            fullwidth
                        />
                        <InputHookForm
                            label='Color'
                            register={register}
                            style='flex-1'
                            errors={errors}
                            id='color'
                            validate={{ required: 'Color is required' }}
                            placeholder='Color of new Product'
                            fullwidth
                        />
                    </div>
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
                                categories?.find(item => item._id === watch('category'))?.brand?.map(itemB =>
                                    ({ code: itemB, value: itemB }))}
                            register={register}
                            id='brand'
                            errors={errors}
                            // validate={{ required: 'Brand is required' }}
                            style='flex-auto'
                            fullwidth
                        />
                    </div>

                    <MarkdownEditor
                        name='description'
                        changeValue={changeValue}
                        label='Description'
                        invalidFields={invalidFields}
                        setInvalidFields={setInvalidFields}
                    />
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
                                    <img src={item.path} alt="imageProduct" className='w-[200px] object-contain' />
                                </div>
                            ))}
                        </div>}
                    <div className='mt-8'>
                        <Button type='submit'>
                            Create
                        </Button>
                    </div>
                </form>
            </div >
        </div >
    )
}

export default CreateProduct
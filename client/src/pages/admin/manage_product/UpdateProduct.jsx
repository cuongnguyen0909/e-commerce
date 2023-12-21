import React, { useCallback, useEffect, useState, memo } from 'react';
import { useForm } from 'react-hook-form';
import { Button, SelectHookForm, MarkdownEditor, InputHookForm, Loading } from '../../../components';
import { getBase64 } from '../../../ultils/helpers';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { apiUpdateProduct, apiDeleteProduct } from '../../../apis';
import { validate } from '../../../ultils/helpers';
import { showModal } from '../../../store/app/appSlice';
const UpdateProduct = ({ editProduct, setEditProduct, render }) => {
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
                imagesPreview.push(toBase64ImagesProduct);
            }
        } catch (error) { }
        setPreview(prev => ({ ...prev, images: imagesPreview }));

    }
    const handleUpdateProduct = async (data) => {
        const invalid = validate(payload, setInvalidFields);
        if (invalid === 0) {
            if (data.category) {
                data.category = categories?.find(item => item.title === data.category)?.title;
                const finalPayload = { ...data, ...payload };
                finalPayload.thumb = data?.thumb?.length === 0 ? preview.thumb : data.thumb[0];
                const formData = new FormData();
                for (let i of Object.entries(finalPayload)) {
                    formData.append(i[0], i[1]);
                }
                finalPayload.images = data?.images?.length === 0 ? preview.images : data.images;
                for (let image of finalPayload.images) {
                    formData.append('images', image);
                }
                console.log(finalPayload)
                dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }))
                const response = await apiUpdateProduct(formData, editProduct?._id);
                dispatch(showModal({ isShowModal: false, modalChildren: null }))
                if (response.status) {
                    window.scrollTo(0, 0);
                    toast.success('Update product successfully!');
                    render();
                    setEditProduct(null);
                } else {
                    toast.error('Update product failed!');
                }
                console.log(response)
            }
        }
    }
    useEffect(() => {
        // console.log(watch('category'))
        // console.log(editProduct)
        reset({
            title: editProduct?.title,
            price: +editProduct?.price,
            quantity: +editProduct?.quantity,
            color: editProduct?.color,
            category: editProduct?.category,
            brand: editProduct?.brand.toLowerCase(),
        })
        setPayload({
            description: typeof editProduct?.description === 'object'
                ? editProduct?.description?.join(', ') : editProduct?.description
        });
        setPreview({
            thumb: editProduct?.thumb,
            images: editProduct?.images
        })
        // console.log(payload.description)
    }, [editProduct])
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
    return (
        <div className='w-full flex flex-col gap-4 relative'>
            <div className='h-[69px] w-full '></div>
            <div className='p-4 bg-gray-100 fixed top-0 flex justify-between right-0 left-[266px] items-center'>
                <h1 className='text-3xl font-bold tracking-tight'>
                    Update Product
                </h1>
                <span
                    className='text-main cursor-pointer'
                    onClick={() => setEditProduct(null)}>Cancel</span>
            </div>
            <div className='p-4'>
                <form onSubmit={handleSubmit(handleUpdateProduct)}>
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
                            options={categories?.map(item => ({ code: item.title, value: item?.title }))}
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
                                categories?.find(item => item?.title === watch('category'))?.brand?.map(itemB =>
                                    ({ code: itemB.toLowerCase(), value: itemB }))}
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
                        value={payload?.description}
                        onFocus={() => {
                            setInvalidFields && setInvalidFields([])
                        }}
                    />
                    <div className='flex flex-col gap-2 mt-8 border-b'>
                        <label className='font-semibold' htmlFor="thumb">Upload thumbnail</label>
                        <div className='flex'>
                            <input
                                type="file"
                                id="thumb"
                                {...register('thumb')}
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
                                {...register('images')} />
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
                            Update
                        </Button>
                    </div>
                </form>
            </div >
        </div>
    )
}

export default memo(UpdateProduct)
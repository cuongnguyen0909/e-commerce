import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { apiGetOneProduct } from '../../apis/product';
import { Breadcrumb, Button, SelectQuantity, InfoItem, ProductInfomation, CustomSlider } from '../../components';
import Slider from 'react-slick';
import ReactImageMagnify from 'react-image-magnify';
import { formatMoney, renderStarFromNumber } from '../../ultils/helpers';
import { productExtraInfo } from '../../ultils/constants';
import { apiGetProducts } from '../../apis/product';
import DomPurify from 'dompurify';
import clsx from 'clsx';
const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
};

const DetailProduct = () => {
    const { pid, category } = useParams();
    const [productData, setProductData] = useState(null);
    const [relatedProduct, setRelatedProduct] = useState(null)
    const [quantity, setQuantity] = useState(1);
    const [currentImage, setCurrentImage] = useState(null);
    const [update, setUpdate] = useState(false);
    const [varriants, setVarriants] = useState(null);
    const [currentProduct, setCurrentProduct] = useState({
        title: '',
        thumb: '',
        images: [],
        price: 0,
        quantity: 0,
        color: '',
    });
    useEffect(() => {
        if (varriants) {
            setCurrentProduct({
                title: productData?.varriants?.find(item => item.sku === varriants)?.title,
                thumb: productData?.varriants?.find(item => item.sku === varriants)?.thumb,
                images: productData?.varriants?.find(item => item.sku === varriants)?.images,
                price: productData?.varriants?.find(item => item.sku === varriants)?.price,
                quantity: productData?.varriants?.find(item => item.sku === varriants)?.quantity,
                color: productData?.varriants?.find(item => item.sku === varriants)?.color,
            })
        } else {
            setCurrentProduct({
                title: productData?.title,
                thumb: productData?.thumb,
                images: productData?.images,
                price: productData?.price,
                quantity: productData?.quantity,
                color: productData?.color,
            })
        }
    }, [varriants])
    // define function fetchProductData
    const fetchProductData = async () => {
        const response = await apiGetOneProduct(pid);
        if (response.status) {
            setProductData(response.product);
            setCurrentImage(response?.product?.thumb);
        }
    }
    const fetchProducts = async () => {
        const response = await apiGetProducts({ category: category.replace(category[0], category[0].toUpperCase()) });
        if (response.status) {
            setRelatedProduct(response.products);
        }
    }
    // define function handleQuantity to prevent re-render when quantity change 
    const handleQuantity = useCallback((number) => {
        if (number < 1) return;
        setQuantity(number);
    }, [quantity]);

    //define handlequantity using useCallBack to prevent re-render when quantity change
    const handleChangeQuantity = useCallback((number) => {
        if (number < 1) return;
        setQuantity(number);
    }, [quantity])

    const handleClickImage = (e, item) => {
        e.stopPropagation();
        setCurrentImage(item);
    }
    useEffect(() => {
        if (pid) {
            fetchProductData();
            fetchProducts();
        };
        window.scrollTo(0, 200);
    }, [pid])

    useEffect(() => {
        if (pid) fetchProductData();
    }, [update])

    const reRender = useCallback(() => {
        setUpdate(!update);
    }, [update])
    // console.log(productData)
    return (
        <div className='w-full gap-2'>

            {/* Breacrumd */}
            <div className='h-[81px] flex justify-center items-center bg-gray-100'>
                <div className='w-main'>
                    <h3 className='font-semibold'>{currentProduct?.title || productData?.title}</h3>
                    <Breadcrumb title={currentProduct?.title || productData?.title} category={category} />
                </div>
            </div>

            {/* Product Detail */}
            <div className='w-main m-auto mt-4 flex'>

                {/* Product Image */}
                <div className='flex flex-col gap-4 w-2/5 px-5'>
                    <div className=' h-[458px]'>
                        <ReactImageMagnify className='border h-[458px]' {...{
                            smallImage: {
                                alt: productData?.title,
                                isFluidWidth: true,
                                src: currentProduct?.thumb || currentImage,
                            },
                            largeImage: {
                                src: currentProduct?.thumb || currentImage,
                                width: 1800,
                                height: 1500
                            }
                        }} />
                    </div>

                    {/* Image Slider */}
                    <div className='w-[458px]'>
                        <Slider {...settings} className='image-slider flex gap-2 justify-between'>
                            {!varriants && productData?.images?.map((item, index) => (
                                <div className='w-full' key={index}>
                                    <img
                                        onClick={e => handleClickImage(e, item)}
                                        src={item} alt={item?.title}
                                        className='object-contain border h-[143px] w-[143px] cursor-pointer' />
                                </div>
                            ))}
                            {varriants && currentProduct?.images?.map((item, index) => (
                                <div className='w-full'
                                    key={index}>
                                    <img
                                        onClick={e => handleClickImage(e, item)}
                                        src={item} alt={item?.title}
                                        className='object-contain border h-[143px] w-[143px] cursor-pointer' />
                                </div>
                            ))}
                        </Slider>
                    </div>
                </div>

                {/* Product Info: price, description */}
                <div className='w-2/5 h-[458px] flex flex-col gap-4'>
                    <h2 className='text-[30px] font-semibold'>
                        {`${formatMoney(currentProduct?.price || productData?.price)} VND`}
                    </h2>
                    <div className='flex items-center mt-4 gap-2'>
                        <div className='flex'>
                            {renderStarFromNumber(productData?.totalRatings)?.map((item, index) => (
                                <span key={index}> {item}</span>
                            ))}
                        </div>
                        <div>
                            <span className='text-xs font-semibold italic text-green-500'>(sold {productData?.sold})</span>
                        </div>
                    </div>
                    <ul className='list-disc text-[14px] text-gray-600 pl-4'>
                        {productData?.description?.length > 1 &&
                            productData?.description?.map((item, index) =>
                            (<li key={index} className='capitalize leading-6'>
                                {item}
                            </li>)
                            )}
                        {productData?.description?.length === 1 &&
                            <div
                                className='text-sm line-clamp-[15]'
                                dangerouslySetInnerHTML={{ __html: DomPurify.sanitize(productData?.description[0]) }}>
                            </div>}
                    </ul>
                    <div className='my-4 items-center gap-4'>
                        <span className='font-bold'>Color</span>
                        <div className='flex flex-wrap gap-4 items-center w-full'>
                            <div
                                onClick={() => setVarriants(null)}
                                className={clsx('flex items-center gap-2 p-2 border cursor-pointer', !varriants && 'border-red-500')}>
                                <img src={productData?.thumb} alt="thumb" className='w-8 h-8 rounded-md object-cover' />
                                <span className='flex flex-col'>
                                    <span>{productData?.color}</span>
                                    <span className='text-xs'>{`${formatMoney(productData?.price)} VND`}</span>
                                </span>
                            </div>
                            {productData?.varriants?.map((item, index) => (
                                <div
                                    key={index}
                                    onClick={() => setVarriants(item.sku)}
                                    className={clsx('flex items-center gap-2 p-2 border cursor-pointer', varriants === item.sku && 'border-red-500')}>
                                    <img src={item?.thumb} alt="thumb" className='w-8 h-8 rounded-md object-cover' />
                                    <span className='flex flex-col'>
                                        <span>{item?.color}</span>
                                        <span className='text-xs'>{`${formatMoney(item?.price)} VND`}</span>
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Quantity */}
                    <div className='flex flex-col gap-8'>
                        <div className='flex items-center gap-4'>
                            <span className='font-semibold'>Quantity </span>
                            <SelectQuantity
                                quantity={quantity}
                                handleQuantity={handleQuantity}
                                handleChangeQuantity={handleChangeQuantity} />
                        </div>
                        <Button fullWidth>
                            Add to cart
                        </Button>
                    </div>
                </div>
                <div className='w-1/5'>
                    {productExtraInfo?.map((item, index) => (
                        <InfoItem key={item.id} title={item.title} value={item.value} icon={item.icon} sub={item.sub} />
                    ))}
                </div>
            </div>
            <div className='w-main flex m-auto mt-4'>
                <ProductInfomation
                    totalRatings={productData?.totalRatings}
                    nameProduct={productData?.title}
                    ratings={productData?.ratings}
                    pid={productData?._id}
                    reRender={reRender} />
            </div>
            <div className='w-main flex m-auto my-8'>
                <div className='w-full'>
                    <h3 className='text-[20px] uppercase font-semibold py-[15px] border-b-2 border-main '>OTHER CUSTOMERS ALSO BUY:</h3>
                    <div className='mt-4'>
                        <CustomSlider normal={true}
                            relatedProduct={relatedProduct}
                        />
                    </div>
                </div>
            </div>
        </div >
    )
}

export default DetailProduct
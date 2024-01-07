import clsx from 'clsx';
import DomPurify from 'dompurify';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactImageMagnify from 'react-image-magnify';
import { useDispatch, useSelector } from 'react-redux';
import { createSearchParams, useLocation, useNavigate, useParams } from 'react-router-dom';
import Slider from 'react-slick';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { apiUpdateCart } from '../../apis';
import { apiGetOneProduct, apiGetProducts } from '../../apis/product';
import { Breadcrumb, Button, CustomSlider, InfoItem, ProductInfomation, SelectQuantity } from '../../components';
import { getCurrent } from '../../store/user/userAction';
import { productExtraInfo } from '../../ultils/constants';
import { formatMoney, renderStarFromNumber } from '../../ultils/helpers';
import path from '../../ultils/path';
const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
};

const DetailProduct = ({ isQuickView, data }) => {
    const titleRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    // const { category } = useParams();
    const params = useParams();
    const { isLoggedIn } = useSelector(state => state.user);
    const [productData, setProductData] = useState(null);
    const [relatedProduct, setRelatedProduct] = useState(null)
    const [quantity, setQuantity] = useState(1);
    const [currentImage, setCurrentImage] = useState(null);
    const [update, setUpdate] = useState(false);
    const [varriants, setVarriants] = useState(null);
    const [pid, setPid] = useState(null);
    const [category, setCategory] = useState(null);
    const [currentProduct, setCurrentProduct] = useState({
        title: '',
        thumb: '',
        images: [],
        price: 0,
        quantity: 0,
        color: '',
    });
    useEffect(() => {
        if (data) {
            setPid(data?.pid);
            setCategory(data?.category);
        } else if (params?.pid) {
            setPid(params?.pid);
            setCategory(params?.category);
        }
        window.scrollTo(0, 0);
    }, [data, params]);

    useEffect(() => {
        if (varriants) {
            setCurrentProduct({
                title: productData?.varriants?.find(item => item.sku === varriants)?.title,
                thumb: productData?.varriants?.find(item => item.sku === varriants)?.thumb,
                images: productData?.varriants?.find(item => item.sku === varriants)?.images,
                price: productData?.varriants?.find(item => item.sku === varriants)?.price,
                quantity: productData?.varriants?.find(item => item.sku === varriants)?.quantity,
                color: productData?.varriants?.find(item => item.sku === varriants)?.color,
            });
        } else {
            setCurrentProduct({
                title: productData?.title,
                thumb: productData?.thumb,
                images: productData?.images || [],
                price: productData?.price,
                quantity: productData?.quantity,
                color: productData?.color,
            });
        }
    }, [varriants, productData])
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
    }, [quantity]);

    const handleClickImage = (e, item) => {
        e.stopPropagation();
        setCurrentImage(item);
    }

    const handleAddToCart = async () => {
        if (!isLoggedIn) {
            return Swal.fire({
                title: 'Please login to continue!',
                icon: 'warning',
                confirmButtonText: 'OK',
                showConfirmButton: true,
                confirmButtonColor: '#ffac12',
                showCancelButton: true,
                cancelButtonText: 'Cancel',
                cancelButtonColor: '#ff0000',
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate({
                        pathname: `/${path.LOGIN}`,
                        search: createSearchParams({ redirect: location.pathname }).toString()
                    });
                }
            });
        }
        const response = await apiUpdateCart({
            pid,
            color: currentProduct?.color || productData?.color,
            quantity,
            price: currentProduct?.price || productData?.price,
            thumb: currentProduct?.thumb || productData?.thumb,
            title: currentProduct?.title || productData?.title,
        });
        if (response.status) {
            toast.success(response.message);
            dispatch(getCurrent());
        } else {
            toast.error(response.message);
        }
    }
    useEffect(() => {
        if (pid) {
            fetchProductData();
            fetchProducts();
        };
        window.scrollTo(0, 0);
        titleRef?.current?.scrollIntoView({ behavior: 'smooth' });
    }, [pid])

    useEffect(() => {
        if (pid) fetchProductData();
    }, [update, pid])

    const reRender = useCallback(() => {
        setUpdate(!update);
    }, [update])
    // console.log(productData)
    return (
        <div className={clsx('w-full gap-2')}>

            {/* Breacrumd */}
            {!isQuickView && <div className='h-[81px] flex justify-center items-center bg-gray-100'>
                <div ref={titleRef} className='w-main'>
                    <h3 className='font-semibold'>{currentProduct?.title || productData?.title}</h3>
                    <Breadcrumb title={currentProduct?.title || productData?.title} category={category} />
                </div>
            </div>}

            {/* Product Detail */}
            <div className={clsx('bg-white m-auto mt-4 flex', isQuickView ? 'max-w-[800px] h-[600px] pt-4 gap-6' : 'w-main gap-6')}
                onClick={e => e.stopPropagation()}
            >

                {/* Product Image */}
                <div className={clsx('flex flex-col gap-4 w-2/5 px-5', isQuickView && 'w-[395px]')}>
                    <div className={clsx(isQuickView ? 'h-[350px]' : 'h-[458px]')}>
                        <ReactImageMagnify className='border h-[458px]' {...{
                            smallImage: {
                                alt: productData?.title,
                                isFluidWidth: true,
                                src: currentImage,
                            },
                            largeImage: {
                                src: currentImage,
                                width: 1800,
                                height: 1500
                            }
                        }} />
                    </div>

                    {/* Image Slider */}
                    <div className={clsx(isQuickView ? 'w-[355px]' : 'w-[458px]')}>
                        <Slider {...settings} className={clsx(isQuickView ? 'image-slider flex gap-2 justify-between' : 'image-slider flex gap-2 justify-between')}>
                            {!varriants && currentProduct?.images?.map((item, index) => (
                                <div className='w-full' key={index}>
                                    <img
                                        onClick={e => handleClickImage(e, item)}
                                        src={item} alt={item?.title}
                                        className={clsx(isQuickView ? 'object-contain border h-[117px] w-[117px] cursor-pointer' : 'object-contain border h-[143px] w-[143px] cursor-pointer')} />
                                </div>
                            ))}
                            {varriants && currentProduct?.images?.map((item, index) => (
                                <div className='w-full'
                                    key={index}>
                                    <img
                                        onClick={e => handleClickImage(e, item)}
                                        src={item} alt={item?.title}
                                        className={clsx(isQuickView ? 'object-contain border h-[117px] w-[117px] cursor-pointer' : 'object-contain border h-[143px] w-[143px] cursor-pointer')} />
                                </div>
                            ))}
                        </Slider>
                    </div>
                </div>

                {/* Product Info: price, description */}
                <div className={clsx(isQuickView ? 'w-2/5 h-[355px] flex flex-col' : 'w-2/5 h-[458px] flex flex-col gap-4')}>
                    <h2 className={clsx(isQuickView ? 'text-[25px] font-semibold' : 'text-[30px] font-semibold')}>
                        {`${formatMoney(currentProduct?.price || productData?.price)} VND`}
                    </h2>

                    {/* //render star rating */}
                    <div className={clsx(isQuickView ? 'flex items-center mt-1 gap-1' : 'flex items-center mt-1 gap-2')}>
                        <div className='flex'>
                            {renderStarFromNumber(productData?.totalRatings)?.map((item, index) => (
                                <span key={index}> {item}</span>
                            ))}
                        </div>
                        <div>
                            <span className='text-xs font-semibold italic text-green-500'>(sold {productData?.sold})</span>
                        </div>
                    </div>
                    <ul className={clsx(isQuickView ? 'list-disc text-[13px] text-gray-600 pl-4' : 'list-disc text-[14px] text-gray-600 pl-4')}>
                        {productData?.description?.length > 1 &&
                            productData?.description?.map((item, index) =>
                            (<li key={index} className='capitalize leading-6'>
                                {item}
                            </li>)
                            )}
                        {productData?.description?.length === 1 &&
                            <div
                                className={clsx(isQuickView ? 'text-[13px] line-clamp-[8]' : 'text-sm line-clamp-[10]')}
                                dangerouslySetInnerHTML={{ __html: DomPurify.sanitize(productData?.description[0]) }}>
                            </div>}
                    </ul>
                    <div className={clsx(isQuickView ? 'my-2 items-center gap-2' : 'items-center gap-4')}>
                        <span className={clsx('font-bold', isQuickView && 'text-sm')}>Color</span>
                        <div className='flex flex-wrap gap-4 items-center w-full'>
                            <div
                                onClick={() => setVarriants(null)}
                                className={clsx('flex items-center gap-2 p-2 border cursor-pointer', !varriants && 'border-red-500')}>
                                <img src={productData?.thumb} alt="thumb" className='w-8 h-8 rounded-md object-cover' />
                                <span className='flex flex-col'>
                                    <span className={clsx(isQuickView ? 'text-xs' : 'text-[13px]')}>{productData?.color}</span>
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
                                        <span className={clsx(isQuickView ? 'text-xs' : 'text-[13px]')}>{item?.color}</span>
                                        <span className='text-xs'>{`${formatMoney(item?.price)} VND`}</span>
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Quantity */}
                    <div className={clsx(isQuickView ? 'flex flex-col gap-4' : 'flex flex-col gap-8')}>
                        <div className={clsx(isQuickView ? 'flex items-center gap-2' : 'flex items-center gap-4')}>
                            <span className={clsx('font-semibold', isQuickView && 'text-sm')}>Quantity </span>
                            <SelectQuantity
                                quantity={quantity}
                                handleQuantity={handleQuantity}
                                handleChangeQuantity={handleChangeQuantity} />
                        </div>
                        <div>
                            <Button
                                handleOnClick={handleAddToCart}
                                fullWidth>
                                Add to cart
                            </Button>
                        </div>
                    </div>
                </div>
                {!isQuickView && <div className='w-[200px]'>
                    {productExtraInfo?.map((item, index) => (
                        <InfoItem key={item.id} title={item.title} value={item.value} sub={item.sub} />
                    ))}
                </div>}
            </div>
            {!isQuickView && <div className='w-main flex m-auto mt-4'>
                <ProductInfomation
                    totalRatings={productData?.totalRatings}
                    nameProduct={productData?.title}
                    ratings={productData?.ratings}
                    pid={productData?._id}
                    reRender={reRender} />
            </div>}

            {/* //related product */}
            {!isQuickView && <div className='w-main flex m-auto my-8'>
                <div className='w-full'>
                    <h3 className='text-[20px] uppercase font-semibold py-[15px] border-b-2 border-main '>OTHER CUSTOMERS ALSO BUY:</h3>
                    <div className='mt-4'>
                        <CustomSlider normal={true}
                            relatedProduct={relatedProduct}
                        />
                    </div>
                </div>
            </div>}
        </div >
    )
}

export default DetailProduct
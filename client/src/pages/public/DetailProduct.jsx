import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { apiGetOneProduct } from '../../apis/product';
import { Breadcrumb, Button, SelectQuantity, InfoItem, ProductInfomation, CustomSlider } from '../../components';
import Slider from 'react-slick';
import ReactImageMagnify from 'react-image-magnify';
import { formatMoney, renderStarFromNumber } from '../../ultils/helpers';
import { productExtraInfo } from '../../ultils/constants';
import { apiGetProducts } from '../../apis/product';

const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
};

const DetailProduct = () => {
    const { pid, title, category } = useParams();
    const [productData, setProductData] = useState(null);
    const [relatedProduct, setRelatedProduct] = useState(null)
    const [quantity, setQuantity] = useState(1);
    // define function fetchProductData
    const fetchProductData = async () => {
        const response = await apiGetOneProduct(pid);
        if (response.status) setProductData(response.product);
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
    useEffect(() => {
        if (pid) fetchProductData();
    }, [pid])
    useEffect(() => {
        if (category) fetchProducts();
    }, [category])
    return (
        <div className='w-full gap-2 '>

            {/* Breacrumd */}
            <div className='h-[81px] flex justify-center items-center bg-gray-100'>
                <div className='w-main'>
                    <h3 className='font-semibold'>{title}</h3>
                    <Breadcrumb title={title} category={category} />
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
                                src: productData?.thumb,
                            },
                            largeImage: {
                                src: productData?.thumb,
                                width: 1800,
                                height: 1500
                            }
                        }} />
                    </div>

                    {/* Image Slider */}
                    <div className='w-[458px]'>
                        <Slider {...settings} className='image-slider flex gap-2 justify-between'>
                            {productData?.images.map((item, index) => (
                                <div className='w-full'>
                                    <img src={item} alt={productData?.title}
                                        className='object-contain border h-[143px]' />
                                </div>
                            ))}
                        </Slider>
                    </div>
                </div>

                {/* Product Info: price, description */}
                <div className='w-2/5 h-[458px] flex flex-col gap-4'>
                    <h2 className='text-[30px] font-semibold'>
                        {`${formatMoney(productData?.price)} VND`}
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
                        {productData?.description.map((item, index) => (
                            <li key={index} className='capitalize leading-6'>
                                {item}
                            </li>
                        )
                        )}
                    </ul>

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
                <ProductInfomation />
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
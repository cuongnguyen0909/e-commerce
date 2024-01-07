import React, { memo, useState } from 'react';
import { BsCartCheckFill } from "react-icons/bs";
import { FaShoppingCart } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { createSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { SelectOption } from '..';
import { apiRemoveProdcutInCart, apiUpdateCart, apiUpdatedWishlist } from '../../apis';
import label from '../../assets/images/label.webp';
import label1 from '../../assets/images/label1.png';
import { DetailProduct } from '../../pages/public';
import { showModal } from '../../store/app/appSlice';
import { getCurrent } from '../../store/user/userAction';
import { formatMoney, renderStarFromNumber } from '../../ultils/helpers';
import icons from '../../ultils/icons';
import path from '../../ultils/path';
import clsx from 'clsx';
const Product = ({ productData, isNew, normal, classname }) => {
    const location = useLocation();
    const [isShowOption, setIsShowOption] = useState(false);
    const { FaHeart, IoEyeSharp } = icons;
    const { isLoggedIn, current, currentCart } = useSelector(state => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleClickOption = async (e, type) => {
        e.stopPropagation();
        if (type === 'WISHLIST') {
            const response = await apiUpdatedWishlist(productData?._id);
            if (response.status) {
                dispatch(getCurrent());//to updated cart
                toast.success(response.message);
            } else {
                toast.error(response.message);
            }
        }
        if (type === 'QUICK_VIEW') {
            dispatch(showModal({
                isShowModal: true,
                modalChildren:
                    <DetailProduct data={{ pid: productData?._id, category: productData?.category }} isQuickView />
            }))
        }
        if (type === 'CART') {
            // console.log(current, productData)
            // console.log(current)
            // console.log(current?.cart)

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
                })
            }
            const response = await apiUpdateCart({
                pid: productData?._id,
                color: productData?.color,
                quantity: 1,
                price: productData?.price,
                thumb: productData?.thumb,
                title: productData?.title
            });

            if (response.status) {
                toast.success(response.message);
                dispatch(getCurrent());
            } else {
                toast.error(response.message);
            }
        }
    }

    return (
        <div className={clsx('w-full text-base px-[10px] relative', classname)}>
            <div className={clsx('w-full border p-[15px] flex flex-col items-center cursor-pointer')}
                onClick={() => navigate(`/${productData?.category}/${productData?._id}/${productData?.title}`)}
                onMouseEnter={e => {
                    e.stopPropagation();
                    setIsShowOption(true);
                }}
                onMouseLeave={e => {
                    e.stopPropagation();
                    setIsShowOption(false);
                }}>
                <div className='relative'>
                    {isShowOption &&
                        <div
                            className='absolute bottom-[20px] gap-3 left-0 right-0 flex justify-center items-center animate-slide-top'>
                            {current?.wishlist?.some(item => item?._id === productData?._id)
                                ? <span
                                    title='Add to wishlist'
                                    onClick={(e) => handleClickOption(e, 'WISHLIST')}>
                                    <SelectOption isAddTiWishlist icon={<FaHeart size={20} color='red' />} />
                                </span>
                                : <span
                                    title='Add to wishlist'
                                    onClick={(e) => handleClickOption(e, 'WISHLIST')}>
                                    <SelectOption icon={<FaHeart size={20} />} />
                                </span>}
                            <span
                                title='Quick view'
                                onClick={(e) => handleClickOption(e, 'QUICK_VIEW')}>
                                <SelectOption icon={<IoEyeSharp size={20} />} />
                            </span>

                            {current?.cart?.some(item => item?.product?._id === productData?._id)
                                ? <span
                                    title='Added to cart'
                                    onClick={(e) => e.stopPropagation()} >
                                    <SelectOption isAddToCart icon={<BsCartCheckFill size={20} color='blue' />} />
                                </span>
                                : <span
                                    title='Add to cart'
                                    onClick={(e) => handleClickOption(e, 'CART')}>
                                    <SelectOption icon={<FaShoppingCart size={20} />} />
                                </span>}
                        </div>}
                    <img src={productData?.thumb || process.eve.SRC_IMAGE_FAIL}
                        alt={productData?.title} className='w-[274px] h-[274px] object-cover' />
                    {!normal &&
                        <img
                            src={isNew ? label1 : label}
                            alt="label"
                            className='absolute top-[-10px] left-[-50px] w-[110px] h-[55px] object-contain' />}
                    {isNew ?
                        <span className='absolute font-medium top-[0px] left-[-10px] text-white'>New</span>
                        : <span className=' absolute top-[0px] font-medium left-[-10px] text-white'>Hot</span>}
                </div>
                <div className='flex flex-col gap-1 mt-[15px] items-start w-full '>
                    <span className='line-clamp-1'>
                        {productData?.title}
                    </span>
                    <span className='flex h-4'> {renderStarFromNumber(productData?.totalRatings)?.map((item, index) => (
                        <span key={index}> {item}</span>
                    ))}</span>
                    <span>
                        {`${formatMoney(productData?.price)} VND`}
                    </span>
                </div>
            </div>
        </div >

    )
}

export default memo(Product);
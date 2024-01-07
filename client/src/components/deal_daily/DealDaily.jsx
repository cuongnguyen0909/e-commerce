import monment from 'moment';
import React, { memo, useEffect, useState } from 'react';
import { apiGetProducts } from '../../apis/product';
import { formatMoney, renderStarFromNumber, secondsToHms } from '../../ultils/helpers';
import icons from '../../ultils/icons';
import { CountDown, SelectOption } from '..';
import { BsCartCheckFill } from 'react-icons/bs';
import { FaHeart, FaShoppingCart } from 'react-icons/fa';
import { IoEyeSharp } from 'react-icons/io5';
import { useSelector } from 'react-redux';
import { getCurrent } from '../../store/user/userAction';
import { useDispatch } from 'react-redux';
import { apiUpdateCart, apiUpdatedWishlist } from '../../apis';
import { toast } from 'react-toastify';
import { DetailProduct } from '../../pages/public';
import { showModal } from '../../store/app/appSlice';
import Swal from 'sweetalert2';
import { createSearchParams, useLocation, useNavigate } from 'react-router-dom';
import path from '../../ultils/path';
const { FaStar, IoMenu } = icons;
let idInterval;
const DealDaily = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [deadaily, setDeadaily] = useState(null)
    const [hour, setHour] = useState(0);
    const [minute, setMinute] = useState(0);
    const [second, setSecond] = useState(0);
    const [expried, setExpried] = useState(false);
    const { current, isLoggedIn } = useSelector(state => state.user);
    console.log(deadaily)
    const handleClickOption = async (e, type) => {
        e.stopPropagation();
        if (type === 'WISHLIST') {
            const response = await apiUpdatedWishlist(deadaily?._id);
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
                    <DetailProduct data={{ pid: deadaily?._id, category: deadaily?.category }} isQuickView />
            }))
        }
        if (type === 'CART') {
            // console.log(current, deadaily)
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
                pid: deadaily?._id,
                color: deadaily?.color,
                quantity: 1,
                price: deadaily?.price,
                thumb: deadaily?.thumb,
                title: deadaily?.title,
            });
            if (response.status) {
                toast.success(response.message);
                dispatch(getCurrent());
            } else {
                toast.error(response.message);
            }
        }
    }
    const fetchDealDaily = async () => {
        try {
            const response = await apiGetProducts({ limit: 1, 'price[gt]': 1000000 });
            if (response.status) {
                setDeadaily(response.products[0]);
                const today = `${monment().format('YYYY-MM-DD')} 5:00:00`;
                const seconds = new Date(today).getTime() - new Date().getTime() + 24 * 60 * 60 * 1000; //24h
                // console.log(new Date().getTime() + 24 * 60 * 60 * 1000);
                // console.log(seconds);
                const number = secondsToHms(seconds);
                setHour(number.h);
                setMinute(number.m);
                setSecond(number.s);
            } else {
                setHour(0);
                setMinute(2);
                setSecond(59);
            }
        } catch (error) {
            console.error(error);
        }
    }
    useEffect(() => {
        idInterval && clearInterval(idInterval)
        fetchDealDaily();
    }, [expried]);

    useEffect(() => {
        idInterval = setInterval(() => {
            if (second > 0) {
                setSecond(prev => prev - 1)
            } else {
                if (minute > 0) {
                    setMinute(prev => prev - 1)
                    setSecond(59)
                } else {
                    if (hour > 0) {
                        setHour(prev => prev - 1)
                        setMinute(59)
                        setSecond(59)
                    } else {
                        setExpried(true)
                    }
                }
            }
        }, 1000)
        return () => {
            clearInterval(idInterval);
        }
    }, [second, minute, hour]);
    return (
        <div className='w-full border flex-auto'>
            <div className='capitalize flex justify-between p-4 w-full'>
                <span className='flex-1 flex justify-center '><FaStar size={20} color='red' /></span>
                <span className='flex-8 font-semibold text-[20px] capitalize text-center flex justify-center text-gray-700'>DEAL DAILY</span>
                <span className='flex-1'></span>
            </div>
            <div className='w-full flex flex-col justify-center items-center pt-8 px-4 gap-2'>
                <img src={deadaily?.thumb || process.env.REACT_APP_SRC_IMAGE_FAIL}
                    onClick={() => navigate(`/${deadaily?.category}/${deadaily?._id}/${deadaily?.title}`)}
                    alt={deadaily?.title} className='w-full object-contain cursor-pointer' />
                <span className='line-clamp-1 cursor-pointer'
                    onClick={() => navigate(`/${deadaily?.category}/${deadaily?._id}/${deadaily?.title}`)}>
                    {deadaily?.title}
                </span>
                <span className='flex h-4'> {renderStarFromNumber(deadaily?.totalRatings, 20)?.map((item, index) => (
                    <span key={index}> {item}</span>
                ))}</span>
                <span>
                    {`${formatMoney(deadaily?.price)} VND`}
                </span>
            </div>
            <div className='px-4 mt-8' >
                <div className='flex justify-center items-center gap-2 mb-10'>
                    <CountDown unit={'Hour'} number={hour} />
                    <CountDown unit={'Minutes'} number={minute} />
                    <CountDown unit={'Seconds'} number={second} />
                </div>
                <div
                    className='flex gap-2 w-full hover:bg-gray-800 bg-main  justify-center items-center py-2'>
                    {/* <IoMenu /> */}
                    {current?.wishlist?.some(item => item?._id === deadaily?._id)
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

                    {current?.cart?.some(item => item?.product?._id === deadaily?._id)
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
                </div>
            </div>
        </div>
    )
}

export default memo(DealDaily)
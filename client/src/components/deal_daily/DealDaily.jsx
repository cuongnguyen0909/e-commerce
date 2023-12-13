import monment from 'moment';
import React, { memo, useEffect, useState } from 'react';
import { apiGetProducts } from '../../apis/product';
import { formatMoney, renderStarFromNumber, secondsToHms } from '../../ultils/helpers';
import icons from '../../ultils/icons';
import { CountDown } from '..';
const { FaStar, IoMenu } = icons;
let idInterval;
const DealDaily = () => {
    const [deadaily, setDeadaily] = useState(null)
    const [hour, setHour] = useState(0);
    const [minute, setMinute] = useState(0);
    const [second, setSecond] = useState(0);
    const [expried, setExpried] = useState(false);
    const fetchDealDaily = async () => {
        try {
            const response = await apiGetProducts({ limit: 1, totalRatings: 5, 'price[gt]': 1000000 });
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
                    alt={deadaily?.title} className='w-full object-contain' />
                <span className='line-clamp-1'>
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
                <button
                    type='button'
                    className='flex gap-2 w-full bg-main hover:bg-gray-800 text-white justify-center items-center py-2'>
                    <IoMenu />
                    <span className=''>OPTION</span>
                </button>
            </div>
        </div>
    )
}

export default memo(DealDaily)
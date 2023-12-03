import React, { useState } from 'react';
import label from '../assets/label.webp';
import label1 from '../assets/label1.png';
import { formatMoney, renderStarFromNumber } from '../ultils/helpers';
import { SelectOption } from './';
import { Link } from 'react-router-dom';
import path from '../ultils/path'
const Product = ({ productData, isNew }) => {
    const [isShowOption, setIsShowOption] = useState(false);
    return (
        <div className='w-full text-base px-[10px]'>
            <Link className='w-full border p-[15px] flex flex-col items-center'
                to={`/${path.DETAIL_PRODUCT}/${productData?._id}/${productData?.title}`}
                onMouseEnter={e => {
                    e.stopPropagation();
                    setIsShowOption(true);
                }}
                onMouseLeave={e => {
                    e.stopPropagation();
                    setIsShowOption(false);
                }}>
                <div className='relative'>
                    {isShowOption && <div className='absolute bottom-[20px] left-0 right-0 flex justify-center items-center animate-slide-top'>
                        <SelectOption />
                    </div>}
                    <img src={productData?.thumb || 'data:image/png;base64,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'}
                        alt={productData?.title} className='w-[274px] h-[274px] object-cover' />
                    <img src={isNew ? label1 : label} alt="label" className='absolute top-[-10px] left-[-37px] w-[90px] h-[35px] object-cover' />
                    {isNew ?
                        <span className='font-medium absolute top-[-10px] left-[-10px] text-white'>New</span>
                        : <span className='font-medium absolute top-[-10px] left-[-10px] text-white'>Hot</span>}
                </div>
                <div className='flex flex-col gap-1 mt-[15px] items-start w-full '>
                    <span className='line-clamp-1'>
                        {productData?.title}
                    </span>
                    <span className='flex h-4'>{renderStarFromNumber(productData?.totalRatings)}</span>
                    <span>
                        {`${formatMoney(productData?.price)} VND`}
                    </span>
                </div>
            </Link>
        </div >

    )
}

export default Product;
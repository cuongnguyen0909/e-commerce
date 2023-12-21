import React, { memo, useState } from 'react';
import { Link } from 'react-router-dom';
import { SelectOption } from '..';
import label from '../../assets/label.webp';
import label1 from '../../assets/label1.png';
import { formatMoney, renderStarFromNumber } from '../../ultils/helpers';
import icons from '../../ultils/icons';
import { useNavigate } from 'react-router-dom';
const Product = ({ productData, isNew, normal }) => {
    const [isShowOption, setIsShowOption] = useState(false);
    const { FaHeart, IoEyeSharp, IoMenu } = icons;
    const navigate = useNavigate();
    const handleClickOption = (e, type) => {
        e.stopPropagation();
        if (type === 'WISHLIST') {
            alert('Add to wishlist');
        }
        if (type === 'QUICK_VIEW') {
            alert('Quick view')
        }
        if (type === 'MENU') {
            navigate(`/${productData?.category.toString().toLowerCase()}/${productData?._id}/${productData?.title}`)
        }
    }
    return (
        <div className='w-full text-base px-[10px]'>
            <div className='w-full border p-[15px] flex flex-col items-center cursor-pointer'
                onClick={() => navigate(`/${productData?.category.toString().toLowerCase()}/${productData?._id}/${productData?.title}`)}
                onMouseEnter={e => {
                    e.stopPropagation();
                    setIsShowOption(true);
                }}
                onMouseLeave={e => {
                    e.stopPropagation();
                    setIsShowOption(false);
                }}>
                <div className='relative'>
                    {isShowOption && <div className='absolute bottom-[20px] gap-3 left-0 right-0 flex justify-center items-center animate-slide-top'>
                        <span
                            onClick={(e) => handleClickOption(e, 'WISHLIST')}>
                            <SelectOption icon={<FaHeart />} />
                        </span>
                        <span onClick={(e) => handleClickOption(e, 'QUICK_VIEW')}>
                            <SelectOption icon={<IoEyeSharp />} />
                        </span>
                        <span
                            onClick={(e) => handleClickOption(e, 'MENU')}>
                            <SelectOption icon={<IoMenu />} />
                        </span>
                    </div>}
                    <img src={productData?.thumb || process.eve.SRC_IMAGE_FAIL}
                        alt={productData?.title} className='w-[274px] h-[274px] object-cover' />
                    {!normal && <img src={isNew ? label1 : label} alt="label" className='absolute top-[-10px] left-[-37px] w-[90px] h-[35px] object-cover' />}
                    {isNew ?
                        <span className='font-medium absolute top-[-10px] left-[-10px] text-white'>New</span>
                        : <span className='font-medium absolute top-[-10px] left-[-10px] text-white'>Hot</span>}
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
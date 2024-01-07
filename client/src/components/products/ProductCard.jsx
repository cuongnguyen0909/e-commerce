import React, { memo } from 'react'
import { formatMoney, renderStarFromNumber } from '../../ultils/helpers';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ price, totalRatings, thumb, title, pid, category }) => {
    const navigate = useNavigate();
    return (
        <div className='w-1/3 flex-auto px-[10px] mb-[20px]'
        >
            <div className='flex w-full border h-[130px]'>
                <img src={thumb} alt="title" className='w-[110px] object-contain p-4 cursor-pointer'
                    onClick={() => navigate(`/${category}/${pid}/${title}`)} />
                <div className='flex flex-col gap-1 mt-[15px] items-start w-full text-xs'
                >
                    <span className='line-clamp-1 capitalize text-sm  cursor-pointer'
                        onClick={() => navigate(`/${category}/${pid}/${title}`)}>
                        {title?.toLowerCase()}
                    </span>
                    <span>
                        {`${formatMoney(price)} VND`}
                    </span>
                    <span className='flex h-4 '> {renderStarFromNumber(totalRatings, 14)?.map((item, index) => (
                        <span key={index}> {item}</span>
                    ))}</span>
                </div>
            </div>
        </div>
    )
}

export default memo(ProductCard)
import React, { memo } from 'react';
import avatar from '../../assets/avatar.png';
import moment from 'moment';
import { renderStarFromNumber } from '../../ultils/helpers';
const Comment = ({ image = avatar, name = 'Anonymous', comment, updatedAt, star }) => {
    return (
        <div className='flex gap-5 border bg-gray-100 w-full'>
            <div className='flex-none'>
                <img src={image} alt="avatar" className='w-[30px] h-[30px] object-cover rounded-full' />
            </div>
            <div className='flex flex-col flex-auto gap-2 '>
                <div className='flex'>
                    <h3 className='font-semibold'>{name}</h3>
                    <span className='italic text-xs'>({moment(updatedAt)?.fromNow()})</span>
                </div>
                <div className='flex flex-col gap-2 text-sm'>
                    <div className='flex items-center gap-1'>
                        <span className='flex items-center gap-1'>{renderStarFromNumber(star, 14)?.map((item, index) => (
                            <span key={index}>{item}</span>
                        ))}</span>
                    </div>
                    <div className='flex items-center'>
                        <span className='flex items-center gap-4 text-[16px] '>{comment}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default memo(Comment)
import React, { memo, useRef, useEffect } from 'react'
import icons from '../../ultils/icons'
const { FaStar } = icons;
const VoteBar = ({ number, ratingCount, ratingTotal }) => {
    const progressBarRef = useRef(null);
    useEffect(() => {
        const percent = Math.round((ratingCount * 100 / ratingTotal)) || 0;
        progressBarRef.current.style.cssText = `right: ${100 - percent}%`
    }, [ratingCount, ratingTotal])
    return (
        <div className='flex items-center gap-4 text-sm text-gray-500'>
            <div className='flex w-[10%] items-center justify-center gap-4 text-sm'>
                <span>{number}</span>
                <FaStar color='orange' />
            </div>
            <div className='w-[75%]'>
                <div className='w-full relative h-[5px] bg-gray-300 rounded-full'>
                    <div ref={progressBarRef} className='absolute inset-0 bg-red-500'>
                    </div>
                </div>
            </div>
            <div className='w-[15%] flex justify-end text-xs text-gray-400'>
                {`${ratingCount || 0} reviewers`}
            </div>
        </div>
    )
}

export default memo(VoteBar)
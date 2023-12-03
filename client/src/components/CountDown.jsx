import React, { memo } from 'react'

const CountDown = ({ unit, number }) => {
    return (
        <div className='w-[30%] h-[60px] flex flex-col justify-center items-center bg-gray-200 rounded-md '>
            <span className='tex-[18px] text-gray-800'>{number}</span>
            <span className='text-xs text-gray-700'>{unit}</span>

        </div>
    )
}

export default memo(CountDown)
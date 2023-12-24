import React, { memo } from 'react'

const InfoItem = ({ icon, title, sub }) => {
    return (
        <div>
            <div className='flex gap-4 items-center border p-2 mb-[10px] '>
                {/* <span className='text-white text-[24px] p-2 flex items-center justify-center bg-gray-800 rounded-full z-50'>
                    {icon}
                </span> */}
                <div className='flex flex-col text-[14px]'>
                    <span className='font-semibold'>{title}</span>
                    <span className='text-[12px] text-gray-500'>{sub}</span>
                </div>

            </div>
        </div>
    )
}

export default memo(InfoItem)
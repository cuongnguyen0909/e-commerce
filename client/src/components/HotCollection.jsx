import React, { memo } from 'react'
import icons from '../ultils/icons'

const { MdNavigateNext } = icons;
const HotCollection = ({ title, image, brand }) => {
    return (
        <div className='w-[396px] border flex p-4 gap-4 min-h-[220px]' >
            <img src={image} alt={title} className='flex-1 w-[144px] h-[129px] object-contain' />
            <div className='flex-1 flex flex-col text-gray-700'>
                <h4 className='text-[14px] font-semibold uppercase'>{title}</h4>
                <ul className='text-[14px] text-gray-500'>
                    {brand?.map((item, index) => (
                        <li key={index}>
                            <MdNavigateNext className='inline-block' />
                            <a href='/'>{item}</a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default memo(HotCollection)
import React, { memo } from 'react'
import icons from '../../ultils/icons'
import { useNavigate } from 'react-router-dom';
const { MdNavigateNext } = icons;

const HotCollection = ({ title, icon, brand }) => {
    const navigate = useNavigate();
    return (
        <div className='w-[396px] border flex p-4 gap-4 min-h-[220px]' >
            <div className='flex-1 flex flex-col text-gray-700'>
                <h4 className='text-[14px] font-semibold uppercase'>{title}</h4>
                <ul className='text-[14px] text-gray-500'>
                    {brand?.map((item, index) => (
                        <li key={index}>
                            <MdNavigateNext className='inline-block' />
                            <span
                                onClick={() => navigate(`/${title.toLowerCase()}?brand=${item}`)}
                                className='cursor-pointer hover:underline'>
                                {item}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default memo(HotCollection)
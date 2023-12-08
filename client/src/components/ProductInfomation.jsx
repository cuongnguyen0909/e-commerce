import React from 'react';
import { memo, useEffect, useState } from 'react';
import { productInfoTabs } from '../ultils/constants';

const actiiveStyle = '';
const notActiveStyle = '';
const ProductInfomation = () => {
    const [activeTab, setActiveTab] = useState(1);
    return (
        <div>
            <div className='flex items-center gap-2 relative bottom-[-1px]'>
                {productInfoTabs?.map((item) => (
                    <span
                        className={`cursor-pointer px-4 p-2 
                bg-gray-200 ${activeTab === item.id && 'bg-white border border-b-0'}`}
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}>
                        {item.name}
                    </span>
                ))}
            </div>
            <div className='w-main h-[300px] border border-gray-300'>
                {productInfoTabs?.map((item) => (
                    <div className={`${activeTab === item.id ? '' : 'hidden'}`}>
                        {item.content}
                    </div>
                ))}
            </div>
        </div >
    )
}

export default memo(ProductInfomation)
import React, { memo } from 'react';
import banner from '../assets/BANNER.jpg';
const Banner = () => {
    return (
        <div className="w-main ">
            <img
                src={banner}
                alt="Banner"
                className="h-[400px] w-full object-cover"
            />
        </div>
    );
};

export default memo(Banner);

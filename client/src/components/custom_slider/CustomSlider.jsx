import React, { memo } from 'react'
import { Product } from '..';
import Slider from 'react-slick';

const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
};
const CustomSlider = ({ activeTab, bestSeller, newestProduct, relatedProduct, normal }) => {
    return (
        <div className='relative'>
            {activeTab ? (
                <Slider {...settings} className='custom-slider relative'>
                    {activeTab === 1
                        ? bestSeller?.map(item => (
                            <Product key={item._id} pid={item._id} productData={item} isNew={false} />
                        ))
                        : newestProduct?.map(item => (
                            <Product key={item._id} pid={item._id} productData={item} isNew={true} />
                        ))}
                </Slider>
            ) : (
                <Slider {...settings} className='custom-slider relative' >
                    {relatedProduct?.map(item => (
                        <Product key={item._id} pid={item._id} productData={item} normal={normal} />
                    ))}
                </Slider>
            )}
        </div>
    )
}

export default memo(CustomSlider)
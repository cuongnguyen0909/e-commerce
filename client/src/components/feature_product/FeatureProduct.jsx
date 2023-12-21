import React, { useState, useEffect, memo } from 'react';
import { ProductCard } from '..';
import { apiGetProducts } from '../../apis/product';
import banner1 from '../../assets/banner1.webp';
import banner2 from '../../assets/banner2.webp';
import banner3 from '../../assets/banner3.webp';
import banner4 from '../../assets/banner4.webp';
const FeatureProduct = () => {
    const [products, setProducts] = useState([]);
    const fetchProducts = async () => {
        try {
            const response = await apiGetProducts({ limit: 9, sort: '-totalRatings', 'price[gt]': 1000000 })
            // console.log(response);
            if (response?.status) {
                // console.log(response);
                setProducts(response.products);
            }
        } catch (error) {
        }
    }
    useEffect(() => {
        fetchProducts();

    }, []);
    return (
        <div className='w-main'>
            <h3 className='text-[20px] uppercase font-semibold py-[15px] border-b-2 border-main '>
                feature product
            </h3>
            <div className='flex flex-wrap mt-[15px] mx-[-10px]'>
                {products?.map(item => (
                    <ProductCard
                        key={item._id}
                        thumb={item?.thumb}
                        title={item?.title}
                        totalRatings={item?.totalRatings}
                        price={item?.price} />
                ))}
            </div>
            <div className='flex justify-between'>
                <img src={banner1} alt="banner1" className='w-[50%] object-contain' />
                <div className='flex flex-col justify-between w-[24%]'>
                    <img src={banner2} alt="banner2" />
                    <img src={banner3} alt="banner3" />
                </div>
                <img src={banner4} alt="banner4" />

            </div>
        </div>
    )
}

export default memo(FeatureProduct)
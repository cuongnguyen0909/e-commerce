import React, { useEffect, useState } from 'react';
import Mansonry from 'react-masonry-css';
import { useSearchParams } from 'react-router-dom';
import { apiGetProducts } from '../../apis';
import { Pagination, Product } from '../../components';
const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
}
const ShowProductSearch = () => {
    const [productData, setProductData] = useState(null);
    const [params] = useSearchParams();
    // console.log(params.entries())
    const fetchProducts = async (queries) => {
        const response = await apiGetProducts({ ...queries, limit: process.env.REACt_APP_LIMIT });
        if (response.status) {
            setProductData(response);
        }
    }
    const queries = Object.fromEntries([...params]);
    useEffect(() => {
        fetchProducts(queries);
    }, [params])
    return (
        <div className='flex flex-col items-center mt-8'>
            <div className='flex items-center text-gray-500'>
                <h2 className='text-[20px] '>
                    <span className='font-semibold'>Your search for </span>
                    <span className='capitalize font-bold'>"{queries?.query}"</span>
                    <span className='font-semibold'> revealed the following:</span>
                </h2>
            </div>
            <div className='mt-8 w-main m-auto'>
                <Mansonry
                    breakpointCols={breakpointColumnsObj}
                    className='flex flex-wrap mx-[-10px]'
                    columnClassName='my-masonry-grid_column mb-[20px]'>
                    {productData?.products?.map((item) => (
                        <Product
                            key={item._id}
                            productData={item}
                            isNew={false}
                            normal={true} />
                    ))}
                </Mansonry>
            </div >
            <div className='w-full text-right flex justify-end'>
                <Pagination
                    totalCount={productData?.total}
                />
            </div>
        </div>
    )
}

export default ShowProductSearch
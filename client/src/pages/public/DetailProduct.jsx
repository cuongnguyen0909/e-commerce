import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { apiGetOneProduct } from '../../apis/product';
import { Breadcrumb } from '../../components';

const DetailProduct = () => {
    const { pid, title, category } = useParams();
    const [productData, setProductData] = useState(null);
    const fetchProductData = async () => {
        const response = await apiGetOneProduct(pid);
        if (response.status) setProductData(response.product);
    }
    useEffect(() => {
        if (pid) fetchProductData();
    }, [pid])
    return (
        <div className='w-full '>
            <div className='h-[81px] flex justify-center items-center bg-gray-100'>
                <div className='w-main'>
                    <h3>{title}</h3>
                    <Breadcrumb title={title} category={category} />
                </div>
            </div>

        </div>
    )
}

export default DetailProduct
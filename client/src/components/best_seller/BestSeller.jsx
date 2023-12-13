import React, { memo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { apiGetProducts } from '../../apis';
import { getNewProduct } from '../../store/products/productAction';
import CustomSlider from '../custom_slider/CustomSlider';

const tabs = [
    { id: 1, name: 'Best Seller', },
    { id: 2, name: 'New Arrivals', }
];

const BestSeller = () => {
    const [bestSeller, setBestSeller] = useState(null);
    const [activeTab, setActiveTab] = useState(1);
    const dispatch = useDispatch();
    const { newProduct } = useSelector(state => state.products);
    const fetchProducts = async () => {
        try {
            const response = await apiGetProducts({ sort: '-cretedAt', 'price[gt]': '8000000' });
            if (response.status) {
                setBestSeller(response.products);
            }
            if (response.status) {
                newProduct = response.products;
            }
        } catch (error) {
            // console.log(error);
        }
    };
    useEffect(() => {
        fetchProducts();
        dispatch(getNewProduct());
    }, []);
    return (
        <div>
            <div className='flex text-[20px] '>
                {tabs?.map(item => (
                    <span key={item.id} className={`flex items-start cursor-pointer font-semibold pr-5 mr-5 uppercase border-r text-gray-400 ${activeTab === item.id ? 'text-gray-950' : ''}`}
                        onClick={() => setActiveTab(item.id)}
                    >{item.name}</span>
                ))}
            </div>
            <div className='border-b border-[1.5px] border-main mt-4'>

            </div>
            <div className='mt-6 mx-[-10px] '>
                <CustomSlider activeTab={activeTab} bestSeller={bestSeller} newestProduct={newProduct} />
            </div>
            <div className='flex w-[440px] gap-4 mt-4 items-center'>
                <img src="https://cdn2.f-cdn.com/contestentries/1414523/974321/5b9b47a565e42_thumb900.jpg" alt="banner" className='object-cover w-full h-full' />
                <img src="https://i.insider.com/655e51654ca513d8242dd116?width=700" alt="banner" className='object-cover w-full h-full' />
            </div>
        </div>
    )
}

export default memo(BestSeller);
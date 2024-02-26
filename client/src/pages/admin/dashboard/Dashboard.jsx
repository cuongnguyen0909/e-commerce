import { Chart, registerables } from 'chart.js';
import React, { useEffect, useState } from 'react';
import { apiGetAllUser, apiGetOrdersByAdmin, apiGetProducts } from '../../../apis';
import { NavLink, useNavigate } from 'react-router-dom';
import path from '../../../ultils/path';
import PieComponent from './PieComponent';

Chart.register(...registerables);

const Dashboard = () => {
    const [userData, setUserData] = useState([]);
    const [productData, setProductData] = useState([]);
    const [orderData, setOrderData] = useState([]);
    const [bestSeller, setBestSeller] = useState([]);
    const navigate = useNavigate();
    const fetchData = async () => {
        try {
            const users = await apiGetAllUser();
            const products = await apiGetProducts();
            const orders = await apiGetOrdersByAdmin()
            const bestSeller = await apiGetProducts({ sort: '-sold', limit: 8 });
            setUserData(users);
            setProductData(products);
            setOrderData(orders);
            setBestSeller(bestSeller.products);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    console.log(bestSeller)
    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="container mx-auto mt-8">
            <h1 className="text-4xl font-bold mb-8 text-sky-800">Admin Dashboard</h1>
            <div className='grid grid-cols-6 text-white gap-5 font-bold'>
                <div
                    onClick={() => navigate(`/${path.ADMIN}/${path.MANAGE_PRODUCT}`)}
                    className='col-span-2 bg-sky-600 h-32 rounded-md flex flex-col p-5 gap-5 cursor-pointer hover:bg-sky-500'>
                    <span>{productData?.total}</span>
                    <span>Products</span>
                </div>
                <div
                    onClick={() => navigate(`/${path.ADMIN}/${path.MANAGE_USER}`)}
                    className='col-span-2 h-32 bg-sky-600 rounded-md flex flex-col p-5 gap-5 cursor-pointer hover:bg-sky-500'>
                    <span>Member</span>
                    <span>{userData?.total}</span>
                </div>
                <div
                    onClick={() => navigate(`/${path.ADMIN}/${path.MANAGE_ORDER}`)}
                    className='col-span-2 h-32 bg-sky-600 rounded-md flex flex-col p-5 gap-5 cursor-pointer hover:bg-sky-500'>
                    <span>Orders</span>
                    <span>{orderData?.total}</span>
                </div>
            </div>
            <div className='w-full h-[500px] flex justify-between items-center'>
                <div className='flex flex-col flex-1 h-full mt-[30px]'>
                    <h3 className='font-semibold border-b'>
                        Top 5 best seller
                    </h3>
                    <ul className='flex flex-col gap-3 mt-4 font-semibold'>
                        {bestSeller?.map((item, index) => (
                            <li key={index} className='flex gap-2 items-center'>
                                <span>{index + 1}</span>
                                <img src={item.thumb} alt="thumb" className='w-10 h-10 object-cover' />
                                <NavLink to={`/${item?.category}/${item?._id}/${item?.title}`}>{item.title}</NavLink>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className='flex flex-1 h-full  justify-center items-center'>
                    <PieComponent />
                </div>
            </div>
        </div >
    );
};

export default Dashboard;

import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { apiGetAllUser, apiGetOrdersByAdmin, apiGetProducts } from '../../../apis';

Chart.register(...registerables);

const Dashboard = () => {
    const [userData, setUserData] = useState([]);
    const [productData, setProductData] = useState([]);
    const [orderData, setOrderData] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState('01');
    const [selectedYear, setSelectedYear] = useState('2023');
    const [totalProductSold, setTotalProductSold] = useState(0);
    const handleChangeMonth = (e) => {
        setSelectedMonth(e.target.value);
    };

    const handleChangeYear = (e) => {
        setSelectedYear(e.target.value);
    };


    const fetchData = async () => {
        try {
            const users = await apiGetAllUser();
            const products = await apiGetProducts();
            const orders = await apiGetOrdersByAdmin()

            setUserData(users);
            setProductData(products);
            setOrderData(orders);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

    const chartData = {
        labels: ['01', '02', '03', '04', '05'],
        datasets: [
            {
                label: 'Số lượng đơn hàng',
                backgroundColor: 'rgba(75,192,192,0.6)',
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 2,
                hoverBackgroundColor: 'rgba(75,192,192,0.8)',
                hoverBorderColor: 'rgba(75,192,192,1)',
                data: orderData?.orders?.map(order => order.quantity) || [],
            },
        ],
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div className="container mx-auto mt-8">
            <h1 className="text-4xl font-bold mb-8 text-indigo-600">Admin Dashboard</h1>

            <div className='grid grid-cols-6'>
                <div className='col-span-2 bg-red-100'>
                    <span>Products</span>
                    <span>{productData?.total}</span>
                </div>
                <div className='col-span-2'>
                    <span>Member</span>
                    <span>{userData?.total}</span>
                </div>
                <div className='col-span-2'>
                    <span>Orders</span>
                    <span>{orderData?.total}</span>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

import React, { memo, useEffect, useState } from 'react';
import { Cell, Pie, PieChart } from 'recharts';
import { apiGetOrdersByAdmin, apiGetProducts } from '../../../apis';

const COLORS = ['#0088FE', '#FFBB28', '#FF8042'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};
const PieComponent = () => {
    const [orderData, setOrderData] = useState([]);
    const [productData, setProductData] = useState([]);
    const fetchData = async () => {
        try {
            const products = await apiGetProducts();
            const orders = await apiGetOrdersByAdmin();

            setProductData(products);
            setOrderData(orders);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    let data = [
        { name: 'Succeded', value: 0 },
        { name: 'Processing', value: 0 },
        { name: 'Canceled', value: 0 },
    ]

    useEffect(() => {
        fetchData();
    }, []);
    console.log(orderData)
    orderData.orders?.forEach(order => {
        if (order?.status === 'Succeded') {
            data[0].value += 1;
        }
        if (order?.status === 'Succeded') {
            data[1].value += 1;
        }
        if (order?.status === 'Canceled') {
            data[2].value += 1;
        }
    })
    console.log(data)
    return (
        <div className='mt-[20px]'>
            <div className='w-full'>
                <h3 className='border-b font-semibold'>
                    Order status
                </h3>
            </div>
            <PieChart width={400} height={400}>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {data?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
            </PieChart>
            <div className='grid grid-cols-3'>
                {data?.map((item, index) => (
                    <span key={index}>{item?.name}</span>
                ))}
            </div>
            <div className='grid grid-cols-3 mt-[10px]'>
                {
                    COLORS.map((color, index) => (
                        <div className='h-[30px] w-[30px]' style={{ backgroundColor: color }} key={index}>

                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default memo(PieComponent)
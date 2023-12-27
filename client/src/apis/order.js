import axios from '../axios';

export const apiCreateOrder = (data) => axios({
    url: '/order/',
    method: 'POST',
    data
});

export const apiGetOrdersByUser = (params) => axios({
    url: '/order/',
    method: 'GET',
    params
});
export const apiGetOrdersByAdmin = (params) => axios({
    url: '/order/admin',
    method: 'GET',
    params
});
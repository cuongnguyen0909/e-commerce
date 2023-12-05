import axios from '../axios';

export const apiGetProducts = (params) => axios({
    url: '/product',
    method: 'GET',
    params: params
})

export const apiGetOneProduct = (pid) => axios({
    url: '/product/' + pid,
    method: 'GET'
})
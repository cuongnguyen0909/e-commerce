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

export const apiRatings = (data) => axios({
    url: '/product/ratings',
    method: 'PUT',
    data: data
})
export const apiCreateProduct = (data) => axios({
    url: '/product/',
    method: 'POST',
    data: data
})
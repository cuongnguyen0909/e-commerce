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

export const apiUpdateProduct = (data, pid) => axios({
    url: '/product/' + pid,
    method: 'PUT',
    data
})

export const apiDeleteProduct = (pid) => axios({
    url: '/product/' + pid,
    method: 'DELETE',
})

export const apiAddVarriant = (data, pid) => axios({
    url: '/product/addvarriant/' + pid,
    method: 'PUT',
    data
})
export const apiUpdateVarriant = (data, pid) => axios({
    url: '/product/updatevarriant/' + pid,
    method: 'PUT',
    data
})
export const apiDeleteVarriant = (pid, sku) => axios({
    url: `/product/deletevarriant/${pid}/${sku}`,
    method: 'DELETE',
})

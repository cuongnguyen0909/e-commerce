import axios from '../axios';

export const apiGetCategories = (params) => axios({
    url: '/productcategories',
    method: 'GET',
    params: params
})
export const apiCreateCatgory = (data) => axios({
    url: '/productcategories',
    method: 'POSt',
    data
})
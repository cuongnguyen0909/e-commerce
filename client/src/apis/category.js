import axios from '../axios';

export const apiGetCategories = (params) => axios({
    url: '/productcategories',
    method: 'GET',
    params: params
})
export const apiCreateCategory = (data) => axios({
    url: '/productcategories',
    method: 'POSt',
    data
})

export const apiDeleteCategory = (title) => axios({
    url: `/productcategories/${title}`,
    method: 'DELETE',
});
export const apiDeleteBrand = (title, brand) => axios({
    url: `/productcategories/${title}/${brand}`,
    method: 'DELETE',
});
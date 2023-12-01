import axios from '../axios';

export const apiGetCategories = () => axios({
    url: '/productcategories',
    method: 'GET',
});

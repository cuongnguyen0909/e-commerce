import axios from '../axios';

export const apiRegister = (data) => axios({
    url: '/user/register',
    method: 'POST',
    data: data,
    withCredentials: true
});
export const apiFinalRegister = (token) => axios({
    url: '/user/finalregister/' + token,
    method: 'PUT',
    withCredentials: true
});
export const apiLogin = (data) => axios({
    url: '/user/login',
    method: 'POST',
    data: data
});
export const apiForgotPassword = (data) => axios({
    url: '/user/forgotpassword',
    method: 'POST',
    data: data
});
export const apiResetPassword = (data) => axios({
    url: '/user/resetpassword',
    method: 'PUT',
    data: data
});
export const apiGetCurrent = () => axios({
    url: '/user/current',
    method: 'GET'
});

export const apiGetAllUser = (params) => axios({
    url: '/user/',
    method: 'GET',
    params
});
export const apiUpdateUser = (data, uid) => axios({
    url: '/user/' + uid,
    method: 'PUT',
    data: data
});
export const apiDeleteUser = (uid) => axios({
    url: '/user/delete/' + uid,
    method: 'DELETE'
});
export const apiUpdateProfile = (data) => axios({
    url: '/user/current',
    method: 'PUT',
    data
});
export const apiUpdateCart = (data) => axios({
    url: '/user/cart',
    method: 'PUT',
    data
});

export const apiRemoveProdcutInCart = (pid, color) => axios({
    url: `/user/remove-cart/${pid}/${color}`,
    method: 'DELETE',
});
export const apiUpdatedWishlist = (pid) => axios({
    url: `/user/wishlist/${pid}`,
    method: 'PUT',
});
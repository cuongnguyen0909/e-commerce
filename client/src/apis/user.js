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
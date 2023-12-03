import React, { useState, useEffect, useCallback } from 'react';
import background_login from '../../assets/background_login.jpg';
import { apiRegister, apiLogin } from '../../apis/user'
import { InputField, Button } from '../../components';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import path from '../../ultils/path';
import { register } from '../../store/user/userSlice';
import { useDispatch } from 'react-redux';


const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const resetPayload = () => {
        setPayload({
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            mobile: ''
        })
    }
    const [isRegister, setIsRegister] = useState(false);
    const [payload, setPayload] = useState(
        {
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            mobile: ''
        }
    )
    const handleSubmit = useCallback(async () => {
        const { firstName, lastName, ...data } = payload;
        if (isRegister) {
            const response = await apiRegister(payload);
            if (response.success) {
                Swal.fire('Congratulation', response.message, 'success')
                    .then(() => {
                        setIsRegister(false);
                        resetPayload();
                    });
            } else {
                Swal.fire('Oops', response.message, 'error')
            }

        } else {
            const result = await apiLogin(data);
            if (result.success) {
                dispatch(register({ isLoggedIn: true, token: result.accessToken, userData: result.userData }));
                navigate(`/${path.HOME}`);
            } else {
                Swal.fire('Oops', result.message, 'error')
            }
        }
    }, [payload, isRegister])
    return (
        <div className='w-screen h-screen relative'>
            <img src={background_login} alt="" className='h-full w-full object-cover' />
            <div className='absolute top-0 bottom-0 lefy-0 right-1/3 items-center justify-center flex'>
                <div className='p-8 bg-white flex flex-col items-center rounded-md min-w-[500px] '>
                    <h1 className='text-[28px] font-semibold text-main mb-8'>{isRegister ? 'REGISTER' : 'LOGIN'}</h1>
                    {isRegister &&
                        <div className='flex items-center justify-center gap-2'>
                            <InputField
                                value={payload.firstName}
                                setValue={setPayload}
                                nameKey='firstName'
                            />
                            <InputField
                                value={payload.lastName}
                                setValue={setPayload}
                                nameKey='lastName'
                            />

                        </div>
                    }
                    <InputField
                        value={payload.email}
                        setValue={setPayload}
                        nameKey='email'
                    />
                    <InputField
                        value={payload.password}
                        setValue={setPayload}
                        nameKey='password'
                        type='password'
                    />
                    {isRegister && <InputField
                        value={payload.mobile}
                        setValue={setPayload}
                        nameKey='mobile'
                    />}
                    <Button
                        name={isRegister ? 'Register' : 'Login'}
                        handleOnClick={handleSubmit}
                        fullWidth
                    />
                    <div className='flex items-center justify-between my-2 w-full text-sm'>
                        {!isRegister && <span className='text-blue-500 hover:underline cursor-pointer'>Forgot your password?</span>}
                        {!isRegister && <span onClick={() => setIsRegister(true)} className='text-blue-500 hover:underline cursor-pointer'>Create an account</span>}
                        {isRegister && <span onClick={() => setIsRegister(false)} className='text-blue-500 hover:underline cursor-pointer w-full text-center'>Go Login</span>}
                    </div>
                </div>
            </div>
        </div>

    )

};

export default Login;

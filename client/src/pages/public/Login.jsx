import React, { useCallback, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { apiLogin, apiRegister, apiForgotPassword, apiFinalRegister } from '../../apis/user';
import background_login from '../../assets/background_login.jpg';
import { Button, InputField } from '../../components';
import { login } from '../../store/user/userSlice';
import path from '../../ultils/path';
import { toast } from 'react-toastify';
import { validate } from '../../ultils/helpers'

const Login = () => {
    //define navigate
    const navigate = useNavigate();
    //define dispatch to dispatch action to redux store 
    const dispatch = useDispatch();
    //define resetPayload
    const resetPayload = () => {
        setPayload({
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            mobile: ''
        })
    }
    const [verifyEmail, setVerifyEmail] = useState(false);
    //define invalidFields
    const [invalidFields, setInvalidFields] = useState([]);
    //define forgotPassword
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    //define isRegister
    const [isRegister, setIsRegister] = useState(false);
    const [token, setToken] = useState('')
    //define payload for login and register
    const [payload, setPayload] = useState(
        {
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            mobile: ''
        }
    )
    const [email, setEmail] = useState('');

    //handle forgot password
    const handleForgotPassword = async () => {
        const response = await apiForgotPassword({ email });
        if (response.status) {
            toast.success(response.message, { theme: 'colored' })

        } else {
            toast.info(response.message, { theme: 'colored' })

        }
    }
    //reset payload when isRegister change
    useEffect(() => {
        resetPayload();
    }, [isRegister])
    //handle register when click 'Create an account'
    //set isRegister
    //use useCallBack to prevent re-render
    const handleSubmit = useCallback(async () => {
        //destructuring payload: firstName = payload.firstName, lastName = payload.lastName, data = payload
        const { firstName, lastName, mobile, ...data } = payload;
        console.log(data);
        console.log(payload);
        const invalidFields = isRegister ? validate(payload, setInvalidFields) : validate(data, setInvalidFields);
        if (invalidFields !== 0) {
            return;
        } else {
            if (isRegister) {
                const response = await apiRegister(payload);
                if (response.status) {
                    setVerifyEmail(true);
                } else {
                    Swal.fire('Oops', response.message, 'error')
                }

            } else {
                const result = await apiLogin(data);
                if (result.status) {
                    dispatch(login({ isLoggedIn: true, token: result.accessToken, userData: result.userData }));
                    navigate(`/${path.HOME}`);
                } else {
                    Swal.fire('Oops', result.message, 'error')
                }
            }
        }

    }, [payload, isRegister, invalidFields])

    //handle final register
    const finalRegister = async () => {
        const response = await apiFinalRegister(token);
        if (response.status) {
            Swal.fire('Congratulation', response.message, 'status')
                .then(() => {
                    setIsRegister(false);
                    resetPayload();
                });
        } else {
            Swal.fire('Oops', response.message, 'error')
        }
        setVerifyEmail(false);
        setToken('');
    }
    return (
        <div className='w-screen h-screen relative'>
            {/* verify email */}
            {verifyEmail &&
                <div className='flex flex-col justify-center items-center absolute top-[-400px] bottom-0 left-0 right-0 backdrop-brightness-50 z-50'>
                    <div className='bg-white w-[500px] rounded-md p-8 flex flex-col'>
                        <div className='flex flex-col justify-center'>
                            <h4>We sent a code to your email. Please enter the code below to verify your email.</h4>
                            <span className='text-[12px] font-semibold text-red-700'>
                                Don't share this code with anyone else.
                            </span>
                        </div>
                        <input type="text"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            className='p-2 border-2 border-slate-950 rounded-md outline-none w-full' />
                        <button
                            className='px-4 py-2 bg-blue-700 font-semibold text-white rounded-md mt-2 w-full'
                            type='text' onClick={finalRegister}>
                            Submit

                        </button>
                    </div>
                </div>}

            {/* //frogot password */}
            {isForgotPassword &&
                <div className='flex flex-col absolute top-0 bottom-0 left-0 right-0
                                animate-slide-right bg-white items-center py-8 z-50'>
                    <div className='flex flex-col gap-4'>
                        <label htmlFor="email">Enten your email:</label>
                        <input type="text" id='email'
                            className='w-[800px] pb-2 border-b outline-none placeholder:text-sm'
                            placeholder='example: abc@gmail.com'
                            value={email}
                            onChange={e => setEmail(e.target.value)} />
                        <div className='flex items-center justify-end gap-4'>
                            <Button name='Submit' handleOnClick={handleForgotPassword} style='px-4 py-2 rounded-md text-white my-2 bg-blue-500 text-semibold' />
                            <Button style='px-4 py-2 rounded-md text-white my-2 bg-main text-semibold bg-orange-500' name='Back' handleOnClick={() => setIsForgotPassword(false)} />
                        </div>
                    </div>
                </div>}

            {/* //login and register */}
            <img src={background_login} alt="" className='h-full w-full object-cover' />
            <div className='absolute top-0 bottom-0 lefy-0 right-1/3 items-center justify-center flex'>
                <div className='p-8 bg-white flex flex-col items-center rounded-md min-w-[500px] '>
                    <h1 className='text-[28px] font-semibold text-main mb-8'>
                        {isRegister ? 'REGISTER' : 'LOGIN'}
                    </h1>
                    {isRegister &&
                        <div className='flex items-center justify-center gap-2'>
                            <InputField
                                value={payload.firstName}
                                setValue={setPayload}
                                nameKey='firstName'
                                invalidFields={invalidFields}
                                setInvalidFields={setInvalidFields}
                            />
                            <InputField
                                value={payload.lastName}
                                setValue={setPayload}
                                nameKey='lastName'
                                invalidFields={invalidFields}
                                setInvalidFields={setInvalidFields}
                            />

                        </div>
                    }
                    <InputField
                        value={payload.email}
                        setValue={setPayload}
                        nameKey='email'
                        invalidFields={invalidFields}
                        setInvalidFields={setInvalidFields}
                    />
                    <InputField
                        value={payload.password}
                        setValue={setPayload}
                        nameKey='password'
                        type='password'
                        invalidFields={invalidFields}
                        setInvalidFields={setInvalidFields}
                    />
                    {isRegister && <InputField
                        value={payload.mobile}
                        setValue={setPayload}
                        nameKey='mobile'
                        invalidFields={invalidFields}
                        setInvalidFields={setInvalidFields}
                    />}
                    <Button name={isRegister ? 'Register' : 'Login'} handleOnClick={handleSubmit} fullWidth />

                    {/* define button */}
                    <div className='flex items-center justify-between my-2 w-full text-sm'>
                        {!isRegister && <span onClick={() => setIsForgotPassword(true)}
                            className='text-blue-500 hover:underline cursor-pointer'>
                            Forgot your password?
                        </span>}
                        {!isRegister && <span onClick={() => setIsRegister(true)}
                            className='text-blue-500 hover:underline cursor-pointer'>Create an account</span>}
                        {isRegister && <span onClick={() => setIsRegister(false)}
                            className='text-blue-500 hover:underline cursor-pointer w-full text-center'>Go Login</span>}
                    </div>
                    <Link to={`/${path.HOME}`} className='text-blue-500 hover:underline cursor-pointer text-[14px]'>Go Home</Link>
                </div>
            </div>
        </div>
    )
};

export default Login;

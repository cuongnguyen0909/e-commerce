import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { apiFinalRegister, apiForgotPassword, apiLogin, apiRegister } from '../../apis';
import background_login from '../../assets/images/background_login.jpg';
import { Button, InputField, Loading } from '../../components';
import { showModal } from '../../store/app/appSlice';
import { login } from '../../store/user/userSlice';
import { validate } from '../../ultils/helpers';
import icons from '../../ultils/icons';
import path from '../../ultils/path';
const Login = () => {
    //define icons
    const { IoMdCloseCircleOutline, TiHomeOutline, IoReturnDownBackOutline } = icons;
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
    const handleCancelVerify = () => {
        setVerifyEmail(false);
        setToken('');
    }
    const [verifyEmail, setVerifyEmail] = useState(false);

    //define invalidFields
    const [invalidFields, setInvalidFields] = useState([]);

    //define forgotPassword
    const [isForgotPassword, setIsForgotPassword] = useState(false);

    //define isRegister
    const [isRegister, setIsRegister] = useState(false);

    //define token
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

    const [searchParams] = useSearchParams();
    //handle forgot password
    const handleForgotPassword = async () => {
        dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }))
        const response = await apiForgotPassword({ email });
        dispatch(showModal({ isShowModal: false, modalChildren: null }))
        if (response.status) {
            window.close();
            toast.success(response.message, { theme: 'colored' })
        } else {
            toast.info(response.message, { theme: 'colored' })
        }
    }

    //reset payload when isRegister change
    useEffect(() => {
        resetPayload();
        // console.log(isRegister)
    }, [isRegister])

    //handle register when click 'Create an account'
    //set isRegister
    //use useCallBack to prevent re-render
    const handleSubmit = useCallback(async () => {
        //destructuring payload: firstName = payload.firstName, lastName = payload.lastName, data = payload
        const { firstName, lastName, mobile, ...data } = payload;
        const invalidFields = isRegister ? validate(payload, setInvalidFields) : validate(data, setInvalidFields);
        if (invalidFields !== 0) {
            return;
        } else {
            if (isRegister) {
                dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }));
                const response = await apiRegister(payload);
                dispatch(showModal({ isShowModal: false, modalChildren: null }));

                if (response.status) {
                    setVerifyEmail(true);
                } else {
                    Swal.fire('Oops', response.message, 'error')
                }

            } else {
                const result = await apiLogin(data);
                if (result.status) {
                    dispatch(login({ isLoggedIn: true, token: result.accessToken, userData: result.userData }));
                    searchParams.get('redirect') ? navigate(searchParams.get('redirect')) : navigate(`/${path.HOME}`);
                } else {
                    Swal.fire('Oops', result.message, 'error')
                }
            }
        }

    }, [payload, isRegister])

    //handle final register
    const finalRegister = async () => {
        const response = await apiFinalRegister(token);
        if (response.status) {
            Swal.fire('Congratulation', response.message, 'status')
                .then(() => {
                    setIsRegister(false);
                    resetPayload();
                    navigate(`/${path.LOGIN}`);
                });
        } else {
            Swal.fire('Oops', response.message, 'error');
        }
        setVerifyEmail(false);
        setToken('');
    }

    return (
        <div className='w-screen h-screen relative'>
            {/* verify email */}
            {verifyEmail &&
                <div className='flex flex-col justify-center items-center absolute top-[-400px] bottom-0 left-0 right-0 backdrop-brightness-50 z-50'
                >
                    <div className='bg-white w-[500px] rounded-md p-8 flex flex-col relative'
                    >
                        <div className='flex flex-col justify-center'
                        >
                            <IoMdCloseCircleOutline size={24} color='red' className='cursor-pointer absolute top-[8px] right-[16px]' onClick={handleCancelVerify} />
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
                                animate-slide-right bg-white items-center py-8 z-50 '>
                    <div className='flex flex-col gap-4 pt-14'>
                        <label htmlFor="email" className='font-medium'>Enten your email:</label>
                        <input type="text" id='email'
                            className='w-[800px] pb-2 border-b outline-none placeholder:text-sm'
                            placeholder='example: abc@gmail.com'
                            value={email}
                            onChange={e => setEmail(e.target.value)} />
                        <div className='flex items-center justify-end gap-4 font-medium'>
                            <Button handleOnClick={handleForgotPassword} style={`px-4 py-2 rounded-md text-white my-2 bg-blue-500 text-semibold`}>
                                Submit
                            </Button>
                            <Button style={`px-4 py-2 rounded-md text-white my-2 bg-main text-semibold bg-orange-500`} handleOnClick={() => setIsForgotPassword(false)}>
                                Back
                            </Button>
                        </div>
                    </div>
                </div>}

            {/* //login and register */}

            <img src={background_login} alt="" className='h-full w-full object-cover' />
            <div className='absolute top-0 bottom-0 lefy-0 right-1/3 items-center justify-center flex'>
                <Link to={`/${path.HOME}`} className='text-blue-500 hover:underline cursor-pointer text-[14px] m-auto'>
                    <TiHomeOutline className={`text-[25px] text-gray-700 hover:text-red-700 
                    ${!isRegister ? 'absolute top-[240px] left-[20px]' : 'absolute top-[170px] left-[20px]'}`} />
                </Link>
                <div className='p-8 bg-white flex flex-col items-center rounded-md min-w-[500px] '>
                    <div className='flex items-center'>
                        <h1 className='text-[28px] font-semibold text-main mb-8 '>
                            {isRegister ? 'REGISTER' : 'LOGIN'}
                        </h1>
                    </div>
                    {isRegister &&
                        <div className='flex items-center justify-center gap-2'>
                            <InputField
                                value={payload.firstName}
                                setValue={setPayload}
                                nameKey='firstName'
                                invalidFields={invalidFields}
                                setInvalidFields={setInvalidFields}
                                border
                            />
                            <InputField
                                value={payload.lastName}
                                setValue={setPayload}
                                nameKey='lastName'
                                invalidFields={invalidFields}
                                setInvalidFields={setInvalidFields}
                                border
                            />
                        </div>
                    }
                    <InputField
                        value={payload.email}
                        setValue={setPayload}
                        nameKey='email'
                        invalidFields={invalidFields}
                        setInvalidFields={setInvalidFields}
                        style='w-[300px]'
                        fullwidth
                        border
                    />
                    <InputField
                        value={payload.password}
                        setValue={setPayload}
                        nameKey='password'
                        type='password'
                        invalidFields={invalidFields}
                        setInvalidFields={setInvalidFields}
                        fullwidth
                        border
                    />
                    {isRegister && <InputField
                        value={payload.mobile}
                        setValue={setPayload}
                        nameKey='mobile'
                        invalidFields={invalidFields}
                        setInvalidFields={setInvalidFields}
                        fullwidth
                        border
                    />}
                    <Button handleOnClick={handleSubmit} fullWidth >
                        {isRegister ? 'Register' : 'Login'}
                    </Button>

                    {/* define button */}
                    <div className='flex items-center justify-between my-2 w-full text-sm'>
                        {!isRegister && <span onClick={() => setIsForgotPassword(true)}
                            className='text-blue-500 hover:underline cursor-pointer'>
                            Forgot your password?
                        </span>}
                        {!isRegister && <span onClick={() => setIsRegister(true)}
                            className='text-blue-500 hover:underline cursor-pointer'>Create an account</span>}
                        {isRegister && <span onClick={() => setIsRegister(false)}
                            className='text-blue-500 hover:underline cursor-pointer text-center'>
                            <IoReturnDownBackOutline className='text-[40px] hover:text-red-700 text-gray-800' />
                        </span>}
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Login;

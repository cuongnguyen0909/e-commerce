import React, { memo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import path from '../ultils/path'
import { getCurrent } from '../store/user/userAction';
import { useDispatch, useSelector } from 'react-redux';
import icons from '../ultils/icons';
import { logout } from '../store/user/userSlice';


const { MdLogout } = icons
const TopHeader = () => {
    const dispatch = useDispatch();
    const { isLoggedIn, current } = useSelector(state => state.user);
    useEffect(() => {
        setTimeout(() => {
            if (isLoggedIn) {
                dispatch(getCurrent())
            }
        }, 100);
    }, [dispatch, isLoggedIn])
    return (
        <div className='h-[38px] w-full bg-main flex justify-center items-center'>
            <div className='w-main flex items-center justify-between text-xs text-white'>
                <span>
                    ORDER ONLINE OR CALL US: 0123-456-789
                </span>
                {isLoggedIn ?
                    <span className='text-[13px] flex gap-2 justify-center items-center'>
                        <span>
                            {`Welcome, ${current?.lastName} ${current?.firstName}`}
                        </span>
                        <span onClick={() => dispatch(logout())}
                            className='hover:rounded-sm hover:bg-gray-200 hover:text-main'>
                            <MdLogout size={20} className='cursor-pointer' />
                        </span>
                    </span> : <Link to={`${path.LOGIN}`} className='hover:text-gray-800'>
                        SIGN IN OR CREATE AN ACCOUNT
                    </Link>}

            </div>
        </div>
    )
}

export default memo(TopHeader)
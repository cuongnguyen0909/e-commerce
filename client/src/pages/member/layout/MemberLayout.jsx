import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import path from '../../../ultils/path'
import { useSelector } from 'react-redux/es/hooks/useSelector'
import { MemberSidebar } from '../../../components'
const MemberLayout = () => {
    const { isLoggedIn, current } = useSelector(state => state.user);

    //check if user is logged in and current user is not null 
    // if not, redirect to login page
    // replace = true: replace current history to new history and remove current history
    if (!isLoggedIn || !current) return <Navigate to={`/${path.LOGIN}`} replace={true} />
    return (
        <div className='flex min-h-screen'>
            <MemberSidebar />
            <div className='flex-auto px-4 bg-gray-100 w-full'>
                <Outlet />
            </div>
        </div>
    )
}

export default MemberLayout
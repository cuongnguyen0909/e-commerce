import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import path from '../../../ultils/path'
import { useSelector } from 'react-redux/es/hooks/useSelector';
import { AdminSidebar } from '../../../components';
const AdminLayout = () => {
    const { isLoggedIn, current } = useSelector(state => state.user);
    // console.log({ isLoggedIn, current })
    //check if user is logged in and current user is not null 
    // if not, redirect to login page
    // if not admin, redirect to home page
    // replace = true: replace current history to new history and remove current history
    if (!isLoggedIn || !current || +current.role !== 2002) return <Navigate to={`/${path.LOGIN}`} replace={true} />
    return (
        <div className='flex w-full bg-gray-100 min-h-screen text-gray'>
            <div className='w-[327px] top-0 bottom-0'>
                <AdminSidebar />
            </div>
            <div className='flex-auto px-4 w-full'>
                <Outlet className='' />
            </div>
        </div>
    )
}

export default AdminLayout
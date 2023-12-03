import React, { memo } from 'react'
import { Link } from 'react-router-dom'
import path from '../ultils/path'

const TopHeader = () => {
    return (
        <div className='h-[38px] w-full bg-main flex justify-center items-center'>
            <div className='w-main flex items-center justify-between text-xs text-white'>
                <span>
                    ORDER ONLINE OR CALL US: 0123-456-789
                </span>
                <Link to={`${path.LOGIN}`} className='hover:text-gray-800'>
                    SIGN IN OR CREATE AN ACCOUNT
                </Link>
            </div>
        </div>
    )
}

export default memo(TopHeader)
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { apiResetPassword } from '../../apis';
import { Button } from '../../components';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const { token } = useParams();
    const handleResetPassword = async () => {
        const response = await apiResetPassword({ password, token });
        if (response.status) {
            toast.success(response.message, { theme: 'colored' })
            navigate('/login')
        } else {
            toast.info(response.message, { theme: 'colored' })
        }
    }
    return (
        <div className='flex flex-col absolute top-0 bottom-0 left-0 right-0
        animate-slide-right bg-white items-center py-8 z-50'>
            <div className='flex flex-col gap-4'>
                <label htmlFor="password">Enten your new password:</label>
                <input type="text" id='password'
                    className='w-[800px] pb-2 border-b outline-none placeholder:text-sm'
                    placeholder='Type here'
                    value={password}
                    onChange={e => setPassword(e.target.value)} />
                <div className='flex items-center justify-end gap-4'>
                    <Button name='Submit' handleOnClick={handleResetPassword} style='px-4 py-2 rounded-md text-white my-2 bg-blue-500 text-semibold'>
                        Submit
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default ResetPassword
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import path from '../../ultils/path';


const FinalRegister = () => {
    const { status } = useParams();
    const navigate = useNavigate();
    useEffect(() => {
        if (status === 'fail') {
            Swal.fire('Oops', 'Something went wrong', 'error').then(() => {
                navigate(`/${path.LOGIN}`);
            })
        }
        if (status === 'success') {
            Swal.fire('Congratulation', 'Registeration completed. Please Login', 'success').then(() => {
                navigate(`/${path.LOGIN}`);
            })
        }
    }, [])
    return (
        <div className='h-screen w-screen bg-gray-100'>
            
        </div>
    )
}

export default FinalRegister
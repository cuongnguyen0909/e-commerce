import React from 'react'
import { Button, InputHookForm, Loading } from '../../../components'
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { apiChangePassword } from '../../../apis';
import { showModal } from '../../../store/app/appSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { getCurrent } from '../../../store/user/userAction';

const ChangePassword = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { register, formState: { errors, isDirty }, handleSubmit, reset } = useForm();
    // const { current } = useSelector(state => state.user);
    const onSubmit = async (data) => {
        const formData = new FormData();
        // formData.append('password', data.password);
        // formData.append('newPassword', data.newPassword);
        // formData.append('reNewPassword', data.reNewPassword);

        // for (var pair of formData.entries()) {
        //     console.log(pair[0] + ', ' + pair[1]);
        // }

        dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }))
        const response = await apiChangePassword({
            password: data.password,
            newPassword: data.newPassword,
            reNewPassword: data.reNewPassword,
        });
        dispatch(showModal({ isShowModal: false, modalChildren: null }))

        if (response.status) {
            toast.success('Change password successfully');
            dispatch(getCurrent());
            navigate('/login')
        } else {
            toast.error(response.message);
        }
    }
    return (
        <div className='w-full relative px-4'>
            <header className='text-xl font-semibold py-4 border-b border-b-blue-200'>
                Change password
            </header>
            <form className='w-3/5 mx-auto py-8 flex flex-col gap-4 font-medium'
                onSubmit={handleSubmit(onSubmit)}>
                <InputHookForm
                    label='Old password'
                    register={register}
                    errors={errors}
                    id='password'
                    validate={{
                        required: 'Old Password is required',
                    }}
                    placeholder='Enter your old password'
                    style='flex-1'
                />
                <InputHookForm
                    label='New password'
                    register={register}
                    errors={errors}
                    id='newPassword'
                    validate={{
                        required: 'New password is required',
                    }}
                    placeholder='Enter your new password'
                    style='flex-1'
                />
                <InputHookForm
                    label='Renew password'
                    register={register}
                    errors={errors}
                    id='reNewPassword'
                    validate={{
                        required: 'Renew Password is required',
                    }}
                    placeholder='Enter your renew password'
                    style='flex-1'
                />
                <div className='w-full flex justify-end'>
                    <Button type='submit'>
                        Update
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default ChangePassword
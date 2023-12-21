import moment from 'moment';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { apiUpdateProfile } from '../../../apis';
import avatar from '../../../assets/avatar.png';
import { Button, InputHookForm } from '../../../components';
import { getCurrent } from '../../../store/user/userAction';
const Personal = () => {
    const dispatch = useDispatch();
    const { register, formState: { errors, isDirty }, handleSubmit, reset } = useForm();
    const { current } = useSelector(state => state.user);

    useEffect(() => {
        reset({
            firstname: current?.firstName,
            lastname: current?.lastName,
            mobile: current?.mobile,
            email: current?.email,
            avatar: current?.avatar
        })
    }, [current])

    const handleUpdateProfile = async (data) => {
        const formData = new FormData();
        // Append the avatar file
        if (data.avatar[0]) {
            formData.append('avatar', data.avatar[0]);
        }
        // Append other data fields
        formData.append('firstname', data.firstname);
        formData.append('lastname', data.lastname);
        formData.append('email', data.email);
        formData.append('mobile', data.mobile);

        const response = await apiUpdateProfile(formData);
        if (response.status) {
            dispatch(getCurrent());
            toast.success('Update profile successfully');
        } else {
            toast.error(response.message);
        }
    }
    return (
        <div className='w-full relative px-4 '>
            <header className='text-3xl font-semibold py-4 border-b border-b-blue-200'>
                Personal
            </header>
            <form onSubmit={handleSubmit(handleUpdateProfile)}
                className='w-3/5 mx-auto py-8 flex flex-col gap-4'>
                <InputHookForm
                    label='First Name'
                    register={register}
                    errors={errors}
                    id='firstname'
                    validate={{
                        required: 'First Name is required',
                    }}
                    style='flex-1'
                />
                <InputHookForm
                    label='Last Name'
                    register={register}
                    errors={errors}
                    id='lastname'
                    validate={{
                        required: 'Last Name is required',
                    }}
                    style='flex-1'
                />
                <InputHookForm
                    label='Email Address'
                    register={register}
                    errors={errors}
                    id='email'
                    validate={{
                        required: 'Email address is required',
                        pattern: {
                            value: /\S+@\S+\.\S+/,
                            message: 'Invalid email address'
                        }
                    }}
                    style='flex-1'
                />
                <InputHookForm
                    label='Mobile'
                    register={register}
                    errors={errors}
                    id='mobile'
                    validate={{
                        required: 'Mobile is required',
                        pattern: {
                            value: /^\d{10}$/,
                            message: 'Mobile must be 10 digits'
                        }
                    }}
                    style='flex-1'
                />
                <div className='flex items-center gap-2'>
                    <span className='font-medium'>Account status:</span>
                    <span>{current?.isBlocked ? 'Blocked' : 'Active'}</span>
                </div>
                <div className='flex items-center gap-2'>
                    <span className='font-medium'>Role</span>
                    <span>{+current?.role === 2002 ? 'Admin' : 'Member'}</span>
                </div>
                <div className='flex items-center gap-2'>
                    <span className='font-medium'>Created At: </span>
                    <span>{moment(current?.createdAt).fromNow()}</span>
                </div>
                <div className='flex items-center gap-2'    >
                    <span className='font-medium'>Avatar </span>
                    <label htmlFor="avatar">
                        <img className='w-[100px] rounded-full' src={current?.avatar || avatar} alt="avatar" />
                    </label>
                    <input
                        type="file"
                        id='avatar'
                        name='avatar'
                        hidden
                        {...register('avatar')}
                    />
                </div>

                {isDirty && <div className='w-full flex justify-end'>
                    <Button type='submit'>
                        Update
                    </Button>
                </div>}
            </form>
        </div>
    )
}

export default Personal
import moment from 'moment';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { apiUpdateProfile } from '../../../apis';
import avatar from '../../../assets/images/avatar.png';
import { Button, InputHookForm, Loading } from '../../../components';
import { getCurrent } from '../../../store/user/userAction';
import { showModal } from '../../../store/app/appSlice';
import { useNavigate, useSearchParams } from 'react-router-dom';
const Personal = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { register, formState: { errors, isDirty }, handleSubmit, reset } = useForm();
    const { current } = useSelector(state => state.user);
    // console.log(current)
    const [searchParams] = useSearchParams();
    useEffect(() => {
        reset({
            firstName: current?.firstName,
            lastName: current?.lastName,
            mobile: current?.mobile,
            email: current?.email,
            avatar: current?.avatar,
            address: current?.address,
        })
    }, [current])

    const handleUpdateProfile = async (data) => {
        const formData = new FormData();
        // Append the avatar file
        // Check if the avatar file has changed
        if (data.avatar[0] && (data.avatar[0].name !== current?.avatarName || data.avatar[0].size !== current?.avatarSize)) {
            formData.append('avatar', data.avatar[0]);
        }
        // Append other data fields
        formData.append('firstName', data.firstName);
        formData.append('lastName', data.lastName);
        formData.append('mobile', data.mobile);
        formData.append('address', data.address);

        dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }))
        const response = await apiUpdateProfile(formData);
        dispatch(showModal({ isShowModal: false, modalChildren: null }))

        if (response.status) {
            dispatch(getCurrent());
            toast.success('Update profile successfully');
            if (searchParams.get('redirect')) {
                navigate(searchParams.get('redirect'));
            }
        } else {
            toast.error(response.message);
        }
    }

    return (
        <div className='w-full relative px-4'>
            <header className='text-xl font-semibold py-4 border-b border-b-blue-200'>
                Profile
            </header>
            <form onSubmit={handleSubmit(handleUpdateProfile)}
                className='w-3/5 font-medium mx-auto py-8 flex flex-col gap-4'>
                <InputHookForm
                    label='First Name'
                    register={register}
                    errors={errors}
                    id='firstName'
                    validate={{
                        required: 'First Name is required',
                    }}
                    style='flex-1'
                />
                <InputHookForm
                    label='Last Name'
                    register={register}
                    errors={errors}
                    id='lastName'
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
                <InputHookForm
                    label='Address'
                    register={register}
                    errors={errors}
                    id='address'
                    validate={{
                        required: 'Address is required',
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
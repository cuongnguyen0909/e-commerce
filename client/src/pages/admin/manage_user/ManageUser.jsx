import moment from 'moment';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiGetAllUser, apiUpdateUser, apiDeleteUser } from '../../../apis';
import { InputField, Pagination, InputHookForm, SelectHookForm, Button } from '../../../components';
import useDebounce from '../../../custom_hook/useDebounce';
import { roles, blockUser } from '../../../ultils/constants';
import { set, useForm } from 'react-hook-form';
import { render } from 'react-dom';
import { toast } from 'react-toastify'
import Swal from 'sweetalert2';
import { FaPen } from "react-icons/fa";
import { IoIosRemoveCircle } from "react-icons/io";
import { FaBackspace } from "react-icons/fa";


const ManageUser = () => {
    //define state to store data from api
    const [usersData, setUsersData] = useState(null)

    //define state to store data from form
    const { handleSubmit, register, formState: { errors }, reset } = useForm();

    //
    const [updated, setUpdated] = useState(false)
    //define state to store queries 
    const [queries, setQueries] = useState({
        query: ''
    })

    //define state to store user when click edit
    const [editUser, setEditUser] = useState(null);

    //get params from url 
    const [params] = useSearchParams();

    //fetch data from api 
    const fetchUsers = async (params) => {
        const response = await apiGetAllUser({ ...params, limit: process.env.REACt_APP_LIMIT });
        // console.log(response)
        if (response.status) {
            setUsersData(response)
        }
    }
    //define function to re-render component when update user success or delete user success
    const render = useCallback(() => {
        setUpdated(!updated)
    }, [updated])


    //use debounce to delay fetch data when user typing
    const queriesDebounce = useDebounce(queries.query, 800);

    //define function to fetch data when queriesDebounce change or params change 
    useEffect(() => {
        const queries = Object.fromEntries([...params]);
        if (queriesDebounce) {
            queries.query = queriesDebounce
        }
        fetchUsers(queries);
    }, [queriesDebounce, params, updated])

    // console.log(editUser)
    const handleUpdateUser = async (data) => {
        const response = await apiUpdateUser(data, editUser?._id);
        console.log('data', data)
        if (response.status) {
            render()
            toast.success(response.updatedUser);
            setEditUser(null)
        } else {
            toast.error(response.updatedUser)
        }
    }

    const handleDeleteUser = (uid) => {
        console.log(uid)
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            showCancelButton: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await apiDeleteUser(uid);
                if (response.status) {
                    toast.success(response.deletedUser);
                    render()
                } else {
                    toast.error(response.deletedUser)
                }
            }
        })
    }

    useEffect(() => {
        if (editUser) {
            reset({
                email: editUser?.email,
                firstName: editUser?.firstName,
                lastName: editUser?.lastName,
                role: +editUser?.role,
                mobile: editUser?.mobile,
                isBlocked: editUser?.isBlocked,
            })
        }
    }, [editUser])
    console.log('editUser', editUser)
    return (
        <div className='w-full'>
            <h1 className='h-[75px] flex justify-between items-center text-3xl font-bold px-4 border'>
                <span>Manage User</span>
            </h1>
            <div className='w-full'>
                <div className='flex justify-end py-4'>
                    <InputField
                        nameKey={'query'}
                        value={queries.query}
                        setValue={setQueries}
                        placeholder='Search something...'
                        isHideLabel
                    />
                </div>
                <form onSubmit={handleSubmit(handleUpdateUser)}>
                    {editUser && <Button type='submit'>Update</Button>}
                    <table className='table-auto mt-6 text-left w-full'>
                        <thead className='font-bold bg-gray-600 text-[13px] border-blue-300 text-center text-white'>
                            <tr className='border border-gray-500'>
                                <th className='text-left px-4 py-2'>#</th>
                                <th className='text-left px-4 py-2'>Email</th>
                                <th className='text-left px-4 py-2'>First name</th>
                                <th className='text-left px-4 py-2'>Last name</th>
                                <th className='text-left px-4 py-2'>Role</th>
                                <th className='text-left px-4 py-2'>Mobile</th>
                                <th className='text-left px-4 py-2'>Status</th>
                                <th className='text-left px-4 py-2'>Created at</th>
                                <th className='text-left px-4 py-2'>Actions</th>
                            </tr>
                        </thead>
                        <tbody className=''>
                            {usersData?.users?.map((item, index) => (
                                <tr key={item?._id} className='border border-gray-400 text-[14px]'>
                                    <td className='py-2 px-4'>{index + 1}</td>
                                    <td className='py-2 px-2'>
                                        {editUser?._id === item._id
                                            ? <InputHookForm
                                                register={register}
                                                fullwidth
                                                errors={errors}
                                                defaultValue={item?.email}
                                                id={'email'}
                                                validate={{
                                                    required: "Required",
                                                    pattern: {
                                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                        message: "invalid email address"
                                                    }
                                                }}
                                            />
                                            : <span>{item?.email}</span>}
                                    </td>
                                    <td className='py-2 px-4'>
                                        {editUser?._id === item._id
                                            ? <InputHookForm
                                                register={register}
                                                fullwidth
                                                errors={errors}
                                                defaultValue={item?.firstName}
                                                id={'firstName'}
                                                validate={{ required: 'First name is required' }}
                                            />
                                            : <span>{item?.firstName}</span>}
                                    </td>
                                    <td className='py-2 px-4'>
                                        {editUser?._id === item._id
                                            ? <InputHookForm
                                                register={register}
                                                fullwidth
                                                errors={errors}
                                                defaultValue={item?.lastName}
                                                id={'lastName'}
                                                validate={{ required: 'Last name is required' }}
                                            />
                                            : <span>{item?.lastName}</span>}
                                    </td>

                                    <td className='py-2 px-6'>
                                        {editUser?._id === item._id
                                            ? <SelectHookForm
                                                register={register}
                                                fullwidth
                                                errors={errors}
                                                defaultValue={item?.role}
                                                id={'role'}
                                                validate={{ required: 'Role is required' }}
                                                options={roles} />
                                            :
                                            <span>
                                                {roles.find(role => +role.code === +item?.role)?.value}
                                            </span>}
                                    </td>
                                    <td className='py-2 px-4'>
                                        {editUser?._id === item._id
                                            ? <InputHookForm
                                                register={register}
                                                fullwidth
                                                errors={errors}
                                                id={'mobile'}
                                                defaultValue={item?.mobile}
                                                validate={{
                                                    required: 'Mobile is required',
                                                    pattern: {
                                                        value: /^[62|0]+\d{10}$/,
                                                        message: "Invalid mobile number"
                                                    }
                                                }}
                                            />
                                            : <span>{item?.mobile}</span>}
                                    </td>
                                    <td className='py-2 px-4 '>
                                        {editUser?._id === item?._id
                                            ? <SelectHookForm
                                                register={register}
                                                fullwidth
                                                errors={errors}
                                                defaultValue={item?.isBlocked}
                                                validate={{ required: 'Status is required' }}
                                                id={'isBlocked'}
                                                options={blockUser} />
                                            : <span>{item?.isBlocked ? 'Blocked' : 'Active'}
                                            </span>}
                                    </td>
                                    <td className='py-2 px-4'>{moment(item?.createdAt).format('DD/MM/YYYY')}</td>
                                    <td className='py-2 px-4 flex justify-center items-center'>
                                        {editUser?._id === item._id
                                            ? <span
                                                onClick={() => setEditUser(null)}
                                                className='px-2 text-orange-600 hover:underline inline-block cursor-pointer'>
                                                <FaBackspace size={20} /></span>
                                            : <span
                                                onClick={() => setEditUser(item)}
                                                className='px-2 text-orange-600 hover:underline inline-block cursor-pointer'>
                                                <FaPen size={20} /></span>}
                                        <span
                                            onClick={() => handleDeleteUser(item._id)}
                                            className='px-2 text-orange-600 hover:underline inline-block cursor-pointer'>
                                            <IoIosRemoveCircle size={20} /></span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </form>
                <div className='w-full text-right flex justify-end'>
                    <Pagination
                        totalCount={usersData?.total}
                    />
                </div>
            </div>
        </div>
    )
}

export default memo(ManageUser)
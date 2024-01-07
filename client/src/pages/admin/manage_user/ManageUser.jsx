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
        // console.log('data', data)
        if (response.status) {
            render()
            toast.success(response.updatedUser);
            setEditUser(null)
        } else {
            toast.error(response.updatedUser)
        }
    }

    const handleDeleteUser = (uid) => {
        // console.log(uid)
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
                        <thead className='font-bold bg-sky-700 text-[15px] border-blue-300 text-center text-white'>
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
                        <tbody className='font-medium'>
                            {usersData?.users?.map((item, index) => (
                                <tr key={item?._id} className='border border-gray-400 text-[14px] h-[80px]'>
                                    <td className='py-2 px-4'>{index + 1}</td>
                                    <td className='py-2 px-2'>
                                        <span>{item?.email}</span>
                                    </td>
                                    <td className='py-2 px-4'>
                                        <span>{item?.firstName}</span>
                                    </td>
                                    <td className='py-2 px-4'>
                                        <span>{item?.lastName}</span>
                                    </td>
                                    <td className='py-2 px-6 select-input-user text-left'>
                                        {editUser?._id === item._id
                                            ? <SelectHookForm
                                                register={register}
                                                fullwidth
                                                style='flex justify-center items-center'
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

                                        <span>{item?.mobile}</span>
                                    </td>
                                    <td className='py-2 px-4 select-input-user'>
                                        {editUser?._id === item?._id
                                            ? <SelectHookForm
                                                register={register}
                                                fullwidth
                                                style='flex justify-center items-center'
                                                errors={errors}
                                                defaultValue={item?.isBlocked}
                                                id={'isBlocked'}
                                                options={blockUser} />
                                            : <span>{item?.isBlocked ? 'Blocked' : 'Active'}
                                            </span>}
                                    </td>
                                    <td className='py-2 px-4'>{moment(item?.createdAt).format('DD/MM/YYYY')}</td>
                                    <td className='py-2 px-4'>
                                        {editUser?._id === item._id
                                            ? <span
                                                title='Back'
                                                onClick={() => setEditUser(null)}
                                                className='px-2 text-orange-600 hover:underline inline-block cursor-pointer m-auto'>
                                                <FaBackspace size={20} />
                                            </span>
                                            : <span
                                                title='Edit'
                                                onClick={() => setEditUser(item)}
                                                className='px-2 text-orange-600 hover:underline inline-block cursor-pointer m-auto'>
                                                <FaPen size={20} /></span>}
                                        <span
                                            title='Delete'
                                            onClick={() => handleDeleteUser(item._id)}
                                            className='px-2 text-orange-600 hover:underline inline-block cursor-pointer m-auto'>
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
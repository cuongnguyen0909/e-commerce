import moment from 'moment';
import React, { useState } from 'react';
import { IoIosRemoveCircle } from 'react-icons/io';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { apiDeleteVarriant } from '../../../apis';
import { formatMoney } from '../../../ultils/helpers';
import CustomVarriant from './CustomVarriant';

const ManageVarriant = ({ viewVarriant, setViewVarriant, pid }) => {
    console.log(viewVarriant)
    const [customVarriant, setCustomVarriant] = useState(null);
    const [params] = useSearchParams();

    const handleDeleteVarriant = async (pid, sku) => {
        const response = await apiDeleteVarriant(pid, sku);
        if (response.status) {
            toast.success('Delete varriant successfully');
        } else {
            toast.error(response.message);
        }
        setViewVarriant(null);
    }

    return (
        <div className='w-full flex flex-col gap-4 relative'>
            <div className='h-[69px] w-full '></div>
            <div className='p-4 bg-gray-100 fixed top-0 flex justify-between right-0 left-[266px] items-center'>
                <h1 className='text-3xl font-bold tracking-tight'>
                    Manage Varriant of {viewVarriant?.title}
                </h1>
                <span
                    className='text-main cursor-pointer'
                    onClick={() => setViewVarriant(null)}>Back</span>
            </div>
            {customVarriant &&
                <div className='absolute inset-0 min-h-screen bg-gray-100 z-50'>
                    <CustomVarriant
                        customVarriant={customVarriant}
                        setCustomVarriant={setCustomVarriant} />
                </div>}
            <table className='table-auto'>
                <thead className='text-center text-[16px]'>
                    <tr className=' bg-sky-700 text-white border-collapse border-gray-100'>
                        <th className='py-2'>#</th>
                        <th className='py-2'>Thumbnail</th>
                        <th className='py-2'>Title</th>
                        <th className='py-2'>Price</th>
                        <th className='py-2'>Quantity</th>
                        <th className='py-2'>Sold</th>
                        <th className='py-2'>Color</th>
                        <th className='py-2'>Updated At</th>
                        <th className='py-2'>Action</th>
                    </tr>
                </thead>
                <tbody className='text-[14px] font-medium'>
                    {viewVarriant?.varriants?.map((item, index) => (
                        <tr key={item._id} className='h-[60px]'>
                            <td className='text-center border-b border-sky-200'>
                                {((params.get('page') > 1 ? params.get('page') - 1 : 0) * process.env.REACt_APP_LIMIT) + (index + 1)}</td>
                            <td className='text-center border-b border-sky-200'>
                                <img src={item?.thumb} alt="thumbnail" className='w-12 h-12 object-cover' />
                            </td>
                            <td className='text-center border-b border-sky-200'>{item?.title}</td>
                            <td className='text-center border-b border-sky-200'>{`${formatMoney(item?.price)} VND`}</td>
                            <td className='text-center border-b border-sky-200'>{item?.quantity}</td>
                            <td className='text-center border-b border-sky-200'>{item?.sold}</td>
                            <td className='text-center border-b border-sky-200'>{item?.color}</td>
                            <td className='text-center border-b border-sky-200'>{moment(item?.updatedAt).format('DD/MM/YYYY')}</td>
                            <td className='text-center border-b border-sky-200'>
                                <span
                                    title='Delete varriant'
                                    className='text-blue-500 hover:underline hover:text-orange-500 inline-block cursor-pointer px-1'
                                    onClick={() => handleDeleteVarriant(pid, item?.sku)}>
                                    <IoIosRemoveCircle size={20} />
                                </span>
                            </td>

                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default ManageVarriant
import React, { memo, useEffect } from 'react'
import usePagination from '../../custom_hook/usePagination'
import PaginationItem from './PaginationItem';
import { useSearchParams } from 'react-router-dom';

const Pagination = ({ totalCount }) => {
    const [params] = useSearchParams();

    useEffect(() => {
        const page = params.get('page') || 1;
    }, [params])
    const pagination = usePagination(totalCount, +params.get('page') || 1);

    // current page = 3 => start = 21 end = 30 
    const range = () => {
        const currentPage = params.get('page');
        const pageSize = +process.env.REACt_APP_LIMIT || 10;
        const start = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
        const end = totalCount === 0 ? 0 : Math.min(+currentPage * pageSize, totalCount)
        // const end = currentPage * pageSize

        return `${start} - ${end}`
    }
    return (
        <div className='flex w-full justify-between items-center'>
            {!+params.get('page') ?
                <span className='text-sm italic'>
                    {`Show products ${Math.min(totalCount, 1)} - ${Math.min(+process.env.REACt_APP_LIMIT, totalCount)} of ${totalCount}`}
                </span>
                : ''}

            {+params.get('page') ? <span className='text-sm italic'> {`Show products ${range()} of ${totalCount}`}</span> : ''}

            <div className='flex items-center'>
                {pagination?.map((item, index) => (
                    <PaginationItem key={index}  >
                        {item}
                    </PaginationItem>
                ))}
            </div>
        </div >
    )
}

export default memo(Pagination)

//first + second + last + sibling + dot
//
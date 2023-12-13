import clsx from 'clsx';
import React, { memo } from 'react';
import { createSearchParams, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
const PaginationItem = ({ children }) => {
    // const { category } = useParams();
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();
    const handleClickPagination = () => {
        const queries = Object.fromEntries([...params]);
        if (Number(children)) {
            queries.page = Number(children);
        }
        navigate({
            pathname: location.pathname,
            search: createSearchParams(queries).toString(),
        })
        window.scrollTo(0, 200);
    }
    return (
        <button
            className={clsx('w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center mr-2', !Number(children) && 'items-end p-2', Number(children) && 'items-center', +params.get('page') === +children && 'rounded-full bg-gray-300', !+params.get('page') && children === 1 && 'rounded-full bg-gray-300')}
            onClick={handleClickPagination}
            type="button"
            disabled={!Number(children)
            } > {children}
        </button >
    )
}

export default memo(PaginationItem)
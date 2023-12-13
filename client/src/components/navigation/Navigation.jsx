import React, { memo, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { InputField } from '../../components';
import { navigation } from '../../ultils/constants';
import path from '../../ultils/path';
const Navigation = () => {
    const navigate = useNavigate();
    const [queries, setQueries] = useState({
        query: ''
    })

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            navigate(`${path.SHOW_PRODUCT_SEARCH}?query=${queries.query}`);
            queries.query = '';
        }
    }
    // console.log(queries.query)
    return (
        <div className="w-main h-[48px] py-2 border-y text-sm flex items-center justify-between">
            <div className='flex'>
                {navigation.map((item) => (
                    <NavLink
                        key={item.id}
                        to={item.path}
                        className={({ isActive }) =>
                            isActive ? 'pr-12 hover:text-main text-main' : 'pr-12 hover:text-main'
                        }
                    >
                        {item.value}
                    </NavLink>
                ))}
            </div>
            <div className='flex'>
                <InputField
                    nameKey={'query'}
                    value={queries.query}
                    setValue={setQueries}
                    style={'w500'}
                    placeholder='Search something...'
                    isHideLabel
                    handleKeyDown={e => handleKeyDown(e)}
                />
            </div>
        </div>
    );
};

export default memo(Navigation);

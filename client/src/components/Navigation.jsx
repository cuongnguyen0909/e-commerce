import React from 'react';
import { navigation } from '../ultils/constants';
import { NavLink } from 'react-router-dom';
import { memo } from 'react';
const Navigation = () => {
    return (
        <div className="w-main h-[48px] py-2 border-y text-sm flex items-center">
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
    );
};

export default memo(Navigation);

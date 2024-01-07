import clsx from 'clsx';
import React, { memo } from 'react'
import Select from 'react-select';
const ReactSelect = ({ label, placeholder, onChange, option = [], value, classname, wrapClassName }) => {
    return (
        <div className={clsx(wrapClassName)}>
            {label && <h3 className='font-medium'>{label}</h3>}
            <Select
                placeholder={placeholder}
                isClearable
                options={option}
                value={value}
                isSearchable
                onChange={(value => onChange(value))}
                formatOptionLabel={(option) =>
                (<div className='flex text-black items-center gap-2'>
                    <span>{option.label}</span>
                </div>)
                }
                className={{ control: () => clsx('border-2 py-[2px]', classname) }}
            />
        </div>
    )
}

export default memo(ReactSelect)
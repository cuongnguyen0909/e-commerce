import React, { memo } from 'react';
import clsx from 'clsx';

const Select = ({ label, options = [], register, errors, id, validate, style, fullwidth, defaultValue }) => {
    return (
        <div className={clsx('flex flex-col h-[78px] gap-2 w-full', style)}>
            {label &&
                <label htmlFor={id}
                    className='w-full text-left'
                >{label}
                </label>}
            <select
                defaultValue={defaultValue}
                className={clsx('form-select', fullwidth && 'w-full', style)}
                id={id}
                {...register(id, validate)}>
                <option value=''>---</option>
                {options?.map((item) => (
                    <option value={item.code}>{item.value}</option>
                ))}
            </select>
            {errors[id] && <small className='text-xs text-red-500'>{errors[id]?.message}</small>}
        </div>
    )
}

export default memo(Select)
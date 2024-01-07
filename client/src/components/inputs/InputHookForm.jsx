import React, { memo } from 'react';
import clsx from 'clsx';

// Define component using react-hook-form
const InputHookForm = ({
    label,
    disabled,
    register,
    errors,
    id,
    validate,
    type = 'text',
    placeholder,
    fullwidth,
    defaultValue,
    style,
    readOnly
}) => {
    return (
        <div className={clsx('flex flex-col h-[78px] gap-2', style)}>
            {label && (
                <label
                    htmlFor={id}
                    className='text-left w-full font-semibold'
                >
                    {label}
                </label>
            )}
            <input
                type={type}
                id={id}
                defaultValue={defaultValue}
                {...register(id, validate)}
                disabled={disabled}
                placeholder={placeholder}
                className={clsx('form-input placeholder:italic', fullwidth && 'w-full', style)}
                readOnly={readOnly}
            />
            {errors[id] && (
                <small className="text-xs text-red-500">{errors[id]?.message}</small>
            )}
        </div>
    );
};

export default memo(InputHookForm);

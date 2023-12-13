import clsx from 'clsx';
import React, { memo } from 'react';

const InputField = ({ value, setValue, nameKey, type, invalidFields, setInvalidFields, style, fullwidth, placeholder, isHideLabel, handleKeyDown, border }) => {
    return (
        <div className={clsx('flex flex-col relative mb-2', fullwidth && 'w-full')}>
            {!isHideLabel && value?.toString().trim() !== '' && (
                <label
                    htmlFor={nameKey}
                    className='text-[10px] absolute top-0 left-[12px] block bg-white animate-slide-len text-gray-800 px-1'
                >
                    {nameKey.toString().slice(0, 1).toUpperCase() + nameKey.slice(1).replace(/([a-z])([A-Z])/g, '$1 $2')}
                </label>
            )}
            <input
                type={type || 'text'}
                className={clsx('px-4 py-2 rounded-sm w-full mt-2 placeholder:text-sm placeholder:italic outline-none', border && ' border')}
                placeholder={
                    placeholder ||
                    nameKey.split('_').join(' ').slice(0, 1).toUpperCase() + nameKey.slice(1).replace(/([a-z])([A-Z])/g, '$1 $2')
                }
                value={value}
                onChange={e => setValue(prev => ({ ...prev, [nameKey]: e.target.value }))}
                onFocus={() => setInvalidFields && setInvalidFields([])}
                onKeyDown={(e) => handleKeyDown && handleKeyDown(e)}
            />
            {invalidFields?.some((item) => item.name === nameKey) && (
                <small className='text-main text-[10px] italic'>{invalidFields?.find((item) => item.name === nameKey)?.message}</small>
            )}
        </div>
    );
};

export default memo(InputField);

import React, { memo } from 'react'

const InputSelect = ({ value, changevalue, options }) => {
    return (
        <select className='form-select w-full text-sm' name="" value={value} onChange={e => changevalue(e.target.value)}>
            <option value="">
                Select an option
            </option>
            {options?.map((option, index) => (
                <option key={option.id} value={option.value}> {option.text}</option>
            ))}
        </select>
    )
}

export default memo(InputSelect)
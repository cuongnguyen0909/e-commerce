import React, { memo } from 'react'

const Button = ({ name, children, handleOnClick, style, fullWidth }) => {
    return (
        <button
            type='button'
            className={style ? style : `px-4 py-2 rounded-md text-white my-2 bg-main text-semibold ${fullWidth ? 'w-full' : 'w-fit'}`}
            onClick={() => handleOnClick && handleOnClick()}
        >
            {name}
            {children}
        </button>
    )
}

export default memo(Button)
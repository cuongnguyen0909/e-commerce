import React from 'react'

const Button = ({ name, handleOnClick, style, iconBefore, iconAfter, fullWidth }) => {
    return (
        <button
            type='button'
            className={style ? style : `px-4 py-2 rounded-md text-white my-2 bg-main text-semibold ${fullWidth ? 'w-full' : 'w-fit'}`}
            onClick={() => handleOnClick && handleOnClick()}
        >
            {iconBefore && <span>iconBefore</span>}
            <span>
                {name}
            </span>
            {iconAfter && <span>iconAfter</span>}
        </button>
    )
}

export default Button
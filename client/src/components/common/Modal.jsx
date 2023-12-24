import React, { memo } from 'react'
import { useDispatch } from 'react-redux';
import { showModal } from '../../store/app/appSlice';

const Modal = ({ children }) => {
    const dispatch = useDispatch();
    return (
        <div onClick={() => dispatch(showModal({ isShowModal: false, modalChildren: null }))}
            className='modal-container backdrop-brightness-90'>
            {children}
        </div>
    )
}

export default memo(Modal)
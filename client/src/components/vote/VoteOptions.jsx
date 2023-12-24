import React, { memo, useRef, useEffect, useState } from 'react';
import logo from '../../assets/logo.png';
import { reviewOption } from '../../ultils/constants';
import icons from '../../ultils/icons';
import Button from '../buttons/Button';

const { FaStar } = icons;
const VoteOptions = ({ nameProduct, handleSubmitReviewOption }) => {
    const modalRef = useRef();
    const [choosenScore, setChoosenScore] = useState(0);
    const [comment, setComment] = useState('');
    useEffect(() => {
        modalRef.current.scrollIntoView({ behavior: 'smooth' })
    }, [])

    return (
        <div
            onClick={e => e.stopPropagation()}
            ref={modalRef}
            className='flex-col bg-white w-[700px] p-4 flex items-center justify-center'>
            <img src={logo} alt="logo" className='w-[300px] my-4 object-contain ' />
            <h2 className='font-bold text-gray-800 text-[18px] pb-4'>{` ${nameProduct}`}</h2>

            <textarea cols="20" rows="5" className='form-textarea w-full placeholder:text-xs placeholder:italic mb-2' placeholder='Type something' value={comment} onChange={e => setComment(e.target.value)}></textarea>
            <div className='w-full flex flex-col gap-4 pb-2'>
                <h3>How do you feel about this product?</h3>
                <div className='flex justify-center items-center gap-4'>
                    {reviewOption?.map((item) => (
                        <div className='w-[100px] bg-gray-200 hover:bg-gray-300 cursor-pointer rounded-md p-4 flex items-center justify-center flex-col gap-2' key={item.id}
                            onClick={() => setChoosenScore(+item.id)}>
                            {(Number(choosenScore) && choosenScore >= item.id) ? <FaStar color='orange' /> : <FaStar color='gray' />}
                            <span>{item.text}</span>
                        </div>
                    ))}
                </div>
            </div>
            <Button fullWidth handleOnClick={() => handleSubmitReviewOption({ comment, score: choosenScore })}>Submit</Button>
        </div>
    )
}

export default memo(VoteOptions)
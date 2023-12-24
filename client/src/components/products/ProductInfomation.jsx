import React, { memo, useEffect, useState, useCallback } from 'react';
import { productInfoTabs } from '../../ultils/constants';
import { VoteBar, Button, VoteOptions, Comment } from '..';
import { renderStarFromNumber } from '../../ultils/helpers';
import { apiRatings } from '../../apis';
import { Link } from 'react-router-dom';
import path from '../../ultils/path';
import { useSelector, useDispatch } from 'react-redux';
import { showModal } from '../../store/app/appSlice';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const ProductInfomation = ({ totalRatings, ratings, nameProduct, pid, reRender }) => {
    const [activeTab, setActiveTab] = useState(1);
    const { isLoggedIn } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmitReviewOption = async ({ comment, score }) => {
        // console.log({ comment, score, pid })
        if (!comment || !pid || !score) {
            alert('Please fill all fields');
            return;
        }
        await apiRatings({ star: score, comment, pid: pid, updatedAt: Date.now() });
        reRender();
        dispatch(showModal({ isShowModal: false, modalChildren: null }))
    }

    const handleReviewNow = () => {
        if (!isLoggedIn) {
            Swal.fire({
                text: 'Please sign in to review this product',
                cancelButtonText: 'Cancel',
                confirmButtonText: 'Sign in',
                showCancelButton: true,
                showConfirmButton: true,
                icon: 'warning',
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate(`/${path.LOGIN}`);
                }
            })
        } else {
            dispatch(showModal({
                isShowModal: true, modalChildren:
                    <VoteOptions nameProduct={nameProduct}
                        handleSubmitReviewOption={handleSubmitReviewOption} />
            }))
        }
    }
    return (
        <div className='w-full'>
            {/* <div className='flex items-center gap-2 bottom-[-1px]'>
                {productInfoTabs?.map((item) => (
                    <span
                        className={`cursor-pointer px-4 p-2 
                bg-gray-200 ${activeTab === item.id && 'bg-white border border-b-0'}`}
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}>
                        {item.name}
                    </span>
                ))}
            </div>

            <div className='w-main min-h-[400px] border border-gray-300'>
                {productInfoTabs?.map((item) => (
                    <div className={`${activeTab === item.id ? '' : 'hidden'}`}>
                        {item.content}
                    </div>
                ))}
            </div> */}
            <div className='border mt-12 w-full'>
                <div className='flex pt-4 flex-col w-full'>
                    <div className='flex'>
                        <div className='flex-4 flex-col gap-2 flex items-center justify-center'>
                            <span className='font-semibold text-3xl'>{`${totalRatings} / 5`}</span>
                            <span className='flex items-center gap-1'>
                                {renderStarFromNumber(totalRatings)?.map((item, index) => (
                                    <span key={index}>{item}</span>
                                ))}</span>
                            <span className='text-sm'>
                                {`${ratings?.length} reviewers`}
                            </span>
                        </div>
                        <div className='flex-6 flex flex-col gap-2 p-4'>
                            {Array.from(Array(5).keys()).reverse().map((item) => (
                                <VoteBar key={item}
                                    number={item + 1}
                                    ratingTotal={ratings?.length}
                                    ratingCount={ratings?.filter(i => i.star === item + 1)?.length} />
                            ))}
                        </div>
                    </div>
                    <div className='p-4 flex justify-center items-center flex-col text-sm gap-1'>
                        <span>Do you want to review this product?</span>
                        <Button
                            handleOnClick={handleReviewNow}
                            style='px-4 py-2 rounded-md text-white my-2 bg-main text-semibold w-fit '
                        >
                            REVIEW NOW
                        </Button>
                    </div>
                    <div className='flex flex-col gap-6 w-full'>
                        {ratings?.map((item) => (
                            <Comment
                                key={item?._id}
                                star={item?.star}
                                updatedAt={item?.updatedAt}
                                comment={item?.comment}
                                name={`${item?.postedBy?.firstName} ${item?.postedBy?.lastName}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div >
    )
}

export default memo(ProductInfomation)
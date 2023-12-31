import React, { memo } from 'react'
import icons from '../../ultils/icons';
const { MdMarkEmailRead } = icons
const Footer = () => {
    return (
        <div className='w-full '>
            <div className='h-[103px] w-full bg-main flex items-center justify-center'>
                <div className='w-main flex items-center'>
                    <div className='flex flex-col flex-1'>
                        <span className='text-[20px] text-gray-100'>SIGN UP TO NEWSLETTER</span>
                        <small className='text-[13px] text-gray-300'>Subcribe now and recive weekly newsletter</small>
                    </div>
                    <div className='flex-1 flex items-center'>
                        <input type='text' placeholder='Email address'
                            className='w-full flex-1 p-2 pr-0 rounded-l-full bg-[#F04646] outline-none text-gray-100 
                        placeholder:text-sm placeholder:text-gray-100 placeholder: italic placeholder:opacity-[50%]' />
                        <div className='w-[40px] h-[40px] bg-[#F04646] rounded-r-full flex items-center justify-center text-white'>
                            <MdMarkEmailRead size={18} />
                        </div>
                    </div>
                </div>
            </div>
            <div className='h-[407px] w-full bg-gray-900 flex items-center justify-center text-white text-[13px]'>
                <div className='w-main flex'>
                    <div className='flex-2 flex flex-col gap-2'>
                        <h3 className='mb-[20px] text-[15px] font-medium border-l-2 border-main pl-[15px]'>ABOUT US</h3>
                        <span>
                            <span>Address: </span>
                            <span className='opacity-70'>1234 Nguyen Hue, Quy Nhon, Binh Dinh, Viet Nam</span>
                        </span>
                        <span>
                            <span>Phone: </span>
                            <span className='opacity-70'>0123-456-789</span>
                        </span>
                        <span>
                            <span>Mail: </span>
                            <span className='opacity-70'>SUPPORT@GMAIL.COM</span>
                        </span>
                    </div>
                    <div className='flex-1 flex flex-col gap-2'>
                        <h3 className='mb-[20px] text-[15px] font-medium border-l-2 border-main pl-[15px]'>INFORMATION</h3>
                        <span>Typography</span>
                        <span>Gallery</span>
                        <span>Store Location</span>
                        <span>Today's Detail</span>
                        <span>Contracts</span>

                    </div>
                    <div className='flex-1 flex flex-col gap-2'>
                        <h3 className='mb-[20px] text-[15px] font-medium border-l-2 border-main pl-[15px]'>WHO WE ARE</h3>
                        <span>Help</span>
                        <span>Free Shipping</span>
                        <span>FAQs</span>
                        <span>Return & Exchange</span>
                        <span>Testimonials</span>
                    </div>
                    <div className='flex-1 flex flex-col '>
                        <h3 className='mb-[20px] text-[15px] font-medium border-l-2 border-main pl-[15px]'>#CELECTRONIC</h3>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default memo(Footer)
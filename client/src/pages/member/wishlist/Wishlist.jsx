import React from 'react'
import { useSelector } from 'react-redux'
import { Button, Product } from '../../../components'

const Wishlist = () => {
    const { current } = useSelector(state => state.user)
    console.log(current)
    return (
        <div className='w-full gap-4 relative'>
            <div className='text-3xl font-bold tracking-tight border-b border-b-blue-200'>
                Wishlist
            </div>
            <div className='p-4 grid grid-cols-5 gap-4'>
                {current?.wishlist?.map(item => (
                    <div
                        key={item._id}
                        className='bg-white rounded-md drop-shadow pt-3 gap-3'>
                        <Product
                            key={item._id}
                            productData={item}
                            pid={item._id}
                            normal
                            classname='bg-white'
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Wishlist
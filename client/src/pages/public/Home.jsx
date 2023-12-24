import React from 'react';
import { useSelector } from 'react-redux';
import { Banner, BestSeller, CustomSlider, FeatureProduct, HotCollection, HomeSidebar, DealDaily } from '../../components';
import clsx from 'clsx';

const Home = () => {
    const { newProduct } = useSelector(state => state.products);
    const { categories } = useSelector(state => state.app);
    // const { isLoggedIn, current } = useSelector(state => state.user);
    const { isShowModal } = useSelector(state => state.app);
    return (
        <div className='mt-6 relative'>
            <div className="w-main flex ">
                <div className="flex flex-col gap-5 w-[25%] flex-auto">
                    <HomeSidebar />
                    {/* <DealDaily /> */}
                </div>
                <div className="flex flex-col gap-5 pl-5 w-[75%] flex-auto">
                    <Banner />
                    <BestSeller />
                </div>
            </div>
            <div className='my-8'>
                <FeatureProduct />
            </div>
            <div className='my-8 w-main'>
                <h3 className='text-[20px] uppercase font-semibold py-[15px] border-b-2 border-main '>
                    new arrivals
                </h3>
                <div className={clsx(isShowModal ? 'hidden' : 'mt-4 mx-[-10px]')}>
                    <CustomSlider
                        activeTab={2}
                        newestProduct={newProduct}
                    />
                </div>
            </div>
            <div className='my-8 w-main'>
                <h3 className='text-[20px] uppercase font-semibold py-[15px] border-b-2 border-main '>
                    hot collections
                </h3>
                <div className='flex flex-wrap gap-4 mt-4 min-h-[202px]'>
                    {categories?.map(item => (
                        <HotCollection
                            key={item._id}
                            title={item.title}
                            image={item.image}
                            brand={item.brand}
                        />
                    ))}
                </div>
            </div>
            {/* <div className='my-8 w-main'>
                <h3 className='text-[20px] uppercase font-semibold py-[15px] border-b-2 border-main '>
                    blog posts
                </h3>
            </div> */}
        </div>
    );
};

export default Home;

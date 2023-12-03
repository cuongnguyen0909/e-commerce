import React from 'react';
import { Banner, BestSeller, SideBar, DealDaily, FeatureProduct, HotCollection, CustomSlider } from '../../components';
import { useSelector } from 'react-redux';

const Home = () => {
    const { newProduct } = useSelector(state => state.products);
    const { categories } = useSelector(state => state.app);
    const { isLoggedIn, current } = useSelector(state => state.user);
    console.log({ isLoggedIn, current });
    return (
        <>
            <div className="w-main flex ">
                <div className="flex flex-col gap-5 w-[25%] flex-auto">
                    <SideBar />
                    {/* <DealDaily /> */}
                </div>
                <div className="flex flex-col gap-5 pl-5 w-[75%] flex-auto ">
                    <Banner />
                    <BestSeller />
                </div>
            </div>
            <div className='my-8'>
                <FeatureProduct />
            </div>
            <div className='my-8 w-full'>
                <h3 className='text-[20px] uppercase font-semibold py-[15px] border-b-2 border-main '>
                    new arrivals
                </h3>
                <div className='mt-4 mx-[-10px]'>
                    <CustomSlider
                        newestProduct={newProduct}
                    />
                </div>
            </div>
            <div className='my-8 w-full'>
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
            <div className='my-8 w-full'>
                <h3 className='text-[20px] uppercase font-semibold py-[15px] border-b-2 border-main '>
                    blog posts
                </h3>

            </div>
        </>

    );
};

export default Home;

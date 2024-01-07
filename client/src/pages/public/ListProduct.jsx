import React, { useCallback, useEffect, useRef, useState } from 'react';
import Mansonry from 'react-masonry-css';
import { createSearchParams, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { apiGetProducts, apiGetCategories } from '../../apis';
import { Breadcrumb, FilterProduct, InputSelect, Pagination, Product } from '../../components';
import { sorts } from '../../ultils/constants';
import { useSelector } from 'react-redux';
import { colors } from '../../ultils/constants';

const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
}
const ListProduct = () => {
    const titleRef = useRef(null);
    const navigate = useNavigate();
    //define params
    const { category } = useParams();
    // const [categories, setCategories] = useState([])
    const { categories } = useSelector(state => state.app)
    //define usestate
    const [products, setProducts] = useState(null)

    //define active click
    const [activeClick, setActiveClick] = useState(null)

    const [params] = useSearchParams();

    const [sort, setSort] = useState('');
    // console.log(params.entries())

    const fetchProductsByCategory = async (queries) => {
        if (category && category !== 'products') {
            queries.category = category;
        } else {
            delete queries.category;
        }
        if (!category) {
            queries.category = 'products';
        }
        const response = await apiGetProducts(queries);
        if (response.status) {
            setProducts(response)
        }
    }

    //useEffect fetch products by category
    useEffect(() => {
        const queries = Object.fromEntries([...params]);
        // queries.color = queries.color;
        // queries.category = category;
        let priceQuery = {};
        if (queries.from && queries.to) {
            priceQuery = {
                '$and': [
                    { price: { gte: Number(queries.from) } },
                    { price: { lte: Number(queries.to) } }
                ]
            };
            delete queries.price;
        } else {
            if (queries.from) {
                queries.price = { gte: Number(queries.from) };
            }
            if (queries.to) {
                queries.price = { lte: Number(queries.to) };
            }
        }
        delete queries.from;
        delete queries.to;
        const finalQueries = { ...priceQuery, ...queries };
        fetchProductsByCategory(finalQueries)
        window.scrollTo(0, 0);
        titleRef?.current?.scrollIntoView({ behavior: 'smooth' });
    }, [params, category])

    // console.log(categories?.find(item => item.title.toLowerCase() === category)?.brand)
    //define function change active filter
    const changeActiveFilter = useCallback((name) => {
        if (activeClick === name) {
            setActiveClick(null);
        } else {
            setActiveClick(name);
        }
    }, [activeClick])

    //define function change sort
    const changeValue = useCallback((value) => {
        setSort(value);
    }, [sort])

    useEffect(() => {
        if (sort) {
            navigate({
                pathname: `/${category}`,
                search: createSearchParams({ sort: sort }).toString()
            })
        }
    }, [sort])
    return (
        <div className='w-full'>

            {/* Breacrumd */}
            <div ref={titleRef} className='h-[81px] flex justify-center items-center bg-gray-100'>
                <div className='w-main'>
                    <h3 className='font-semibold uppercase'>{category}</h3>
                    <Breadcrumb category={category} />
                </div>
            </div>
            <div className='w-main border p-4 flex justify-between mt-8 m-auto'>
                <div className='flex flex-col justify-center gap-4'>
                    <span className='font-semibold'>Filter By</span>

                    {/* filter */}
                    <div className='w-4/5 flex flex-auto items-center gap-4'>
                        <FilterProduct
                            name='Price'
                            activeClick={activeClick}
                            changeActiveFilter={changeActiveFilter}
                            type='input' />
                        <FilterProduct
                            name='Color'
                            activeClick={activeClick}
                            changeActiveFilter={changeActiveFilter}
                            colors={colors}
                        />
                        <FilterProduct
                            name='Category'
                            activeClick={activeClick}
                            changeActiveFilter={changeActiveFilter}
                            categories={categories?.map(item => item.title)}
                        />
                        <FilterProduct
                            name='Brand'
                            activeClick={activeClick}
                            changeActiveFilter={changeActiveFilter}
                            brands={categories?.find(item => item.title.toLowerCase() === category)?.brand}
                        />
                    </div>
                </div>

                {/* sort by */}
                <div className='w-1/5 flex flex-col'>
                    <span className='font-semibold'>Sort By</span>
                    <div className='w-4/5 flex flex-auto items-center gap-4'>
                        <InputSelect
                            value={sort}
                            options={sorts}
                            changevalue={changeValue}
                        />
                    </div>
                </div>
            </div>

            {/* //show List product */}
            <div className='mt-8 w-main m-auto'>
                <Mansonry
                    breakpointCols={breakpointColumnsObj}
                    className='flex flex-wrap mx-[-10px]'
                    columnClassName='my-masonry-grid_column mb-[20px]'>
                    {products?.products?.map((item) => (
                        <Product
                            key={item._id}
                            pid={item._id}
                            productData={item}
                            isNew={false}
                            normal={true} />
                    ))}
                </Mansonry>
            </div >
            {products?.products?.length > 0 &&
                <div className='w-main m-auto my-4 flex justify-end'>
                    <Pagination
                        totalCount={products?.total}
                    />
                </div>}

        </div >
    )
}

export default ListProduct
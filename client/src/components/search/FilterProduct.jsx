import React, { memo, useEffect, useState } from 'react';
import icons from '../../ultils/icons';
import { colors } from '../../ultils/constants';
import { createSearchParams, useNavigate, useParams, useSearchParams } from 'react-router-dom';
// import path from '../ultils/path';
import { apiGetProducts } from '../../apis';
import { formatMoney } from '../../ultils/helpers';
import useDebounce from '../../custom_hook/useDebounce';

const { IoChevronDown } = icons;

const FilterProduct = ({ name, activeClick, changeActiveFilter, type = 'checkbox', brands, colors, categories }) => {
    //take params from url 
    const { category } = useParams();
    // console.log(category)

    //define navigate 
    const navigate = useNavigate();

    const [priceFilter, setPriceFilter] = useState({
        from: 0,
        to: 0
    })

    //define selected color 
    const [colorSelected, setColorSelected] = useState([]);
    const [brandsSelected, setBrandsSelected] = useState([]);
    const [categorySelected, setCategorySelected] = useState([]);

    const [params] = useSearchParams();
    //define highest price
    const [highestPrice, setHighestPrice] = useState(null);

    //define function handle click input 
    const handleClickInputColor = (e) => {
        const alreadySelected = colorSelected.find(item => item === e.target.value);
        if (alreadySelected) {
            setColorSelected(prev => prev.filter(item => item !== e.target.value))
        } else {
            setColorSelected(prev => [...prev, e.target.value])
        }
        changeActiveFilter(null);
    }

    const handleClickInputBrand = (e) => {
        const alreadySelected = brandsSelected.find(item => item === e.target.value);
        if (alreadySelected) {
            setBrandsSelected(prev => prev.filter(item => item !== e.target.value))
        } else {
            setBrandsSelected(prev => [...prev, e.target.value])
        }
        changeActiveFilter(null);
    }

    const handleClickInputCategory = (e) => {
        const alreadySelected = categorySelected.find(item => item === e.target.value);
        if (alreadySelected) {
            setCategorySelected(prev => prev.filter(item => item !== e.target.value))
        } else {
            setCategorySelected(prev => [...prev, e.target.value])
        }
        changeActiveFilter(null);
    }

    //define function to fetch highest price
    const fetchHighestPrice = async () => {
        const response = await apiGetProducts({ sort: '-price', limit: 1, category: category.toString() });
        if (response.status) {
            setHighestPrice([response?.products[0]?.price])
        }
    }

    //define useEffect for filter by price
    useEffect(() => {
        if (type === 'input') {
            fetchHighestPrice();
        }
    }, [type])

    useEffect(() => {
        if (priceFilter.from && priceFilter.to && priceFilter.from > priceFilter.to) {
            alert('From price must be less than to price');
        }
    }, [priceFilter])


    //define useEffect for filter by color
    useEffect(() => {
        const queries = Object.fromEntries([...params]);
        if (colorSelected.length > 0) {
            queries.color = colorSelected.join(',')
            queries.page = 1;
        } else {
            delete queries.color;
        }
        navigate({
            pathname: `/${category}`,
            search: createSearchParams(queries).toString()
        })
    }, [colorSelected])

    useEffect(() => {
        const queries = Object.fromEntries([...params]);
        if (brandsSelected.length > 0) {
            queries.brand = brandsSelected.join(',')
            queries.page = 1;
        } else {
            delete queries.brand;
        }
        navigate({
            pathname: `/${category}`,
            search: createSearchParams(queries).toString()
        })
    }, [brandsSelected])


    useEffect(() => {
        const queries = Object.fromEntries([...params]);
        if (category === 'products' && categorySelected.length > 0) {
            queries.page = 1;
            navigate({
                pathname: `/${categorySelected.toString().toLowerCase()}`,
                search: createSearchParams(queries).toString()
            })
        } else {
            navigate({
                pathname: `/products`,
                search: createSearchParams(queries).toString()
            })
        }
    }, [categorySelected])

    //define debounce price filter 
    const debouncePriceFrom = useDebounce(priceFilter.from, 500);
    const debouncePriceTo = useDebounce(priceFilter.to, 500);
    useEffect(() => {
        const data = {};
        let param = [];
        const queries = {};
        for (let i of params.entries()) {
            param.push(i)
        }
        for (let i of param) {
            queries[i[0]] = i[1];
        }
        if (Number(priceFilter.from) > 0) {
            queries.from = priceFilter.from;
        } else {
            delete queries.from;
        }
        if (Number(priceFilter?.to) > 0) {
            queries.to = priceFilter.to;
        } else {
            delete queries.to;
        }
        queries.page = 1;
        navigate({
            pathname: `/${category}`,
            search: createSearchParams(queries).toString()
        })
    }, [debouncePriceFrom, debouncePriceTo])

    return (
        <div
            className='p-3 cursor-pointer text-gray-600 text-xs border gap-4 relative border-gray-800 flex justify-between items-center'
            onClick={() => changeActiveFilter(name)}>
            <span >{name}</span>
            <IoChevronDown />
            {activeClick === name && <div className='absolute z-10 top-[calc(100%+1px)] left-0 w-fit p-4 border bg-white min-w-[150px] '>
                {colors && type === 'checkbox' &&
                    <div onClick={e => e.stopPropagation()}>
                        <div className='p-4 items-center flex justify-between gap-8 border-b'>
                            <span className='whitespace-nowrap'>{`${colorSelected.length} selected`}</span>
                            <span className='cursor-pointer underline hover:text-main'
                                onClick={e => {
                                    e.stopPropagation();
                                    setColorSelected([])
                                }}>
                                Reset
                            </span>
                        </div>
                        <div onClick={e => e.stopPropagation()} className='flex-col flex gap-3 mt-4'>
                            {colors?.map((item, index) => (
                                <div className='flex items-center gap-4'>
                                    <input
                                        type='checkbox'
                                        id={item}
                                        key={index}
                                        name={item}
                                        className='w-4 h-4'
                                        value={item}
                                        onChange={handleClickInputColor}
                                        checked={colorSelected.length === 0 ? false : colorSelected.find(i => i === item)}
                                    />
                                    <label className='capitalize text-gray-700' htmlFor={item}>{item}</label>
                                </div>
                            ))}
                        </div>
                    </div>}
                {brands && type === 'checkbox' &&
                    <div onClick={e => e.stopPropagation()}>
                        <div className='p-4 items-center flex justify-center gap-8 border-b'>
                            <span className='cursor-pointer underline hover:text-main'
                                onClick={e => {
                                    e.stopPropagation();
                                    setBrandsSelected([])
                                }}>
                                Reset</span>
                        </div>
                        <div onClick={e => e.stopPropagation()} className='flex-col flex gap-3 mt-4'>
                            {brands?.map((item, index) => (
                                <div className='flex items-center gap-4'>
                                    <input
                                        type='checkbox'
                                        id={item}
                                        key={index}
                                        name={item}
                                        className='w-4 h-4'
                                        value={item}
                                        onChange={handleClickInputBrand}
                                        checked={brandsSelected.length === 0 ? false : brandsSelected.find(i => i === item)}
                                    />
                                    <label className='capitalize text-gray-700' htmlFor={item}>{item}</label>
                                </div>
                            ))}
                        </div>
                    </div>}
                {categories && type === 'checkbox' &&
                    <div onClick={e => e.stopPropagation()}>
                        <div className='p-4 items-center flex justify-center gap-8 border-b'>
                            <span className='cursor-pointer underline hover:text-main'
                                onClick={e => {
                                    e.stopPropagation();
                                    setCategorySelected([])
                                }}>
                                Reset</span>
                        </div>
                        <div onClick={e => e.stopPropagation()} className='flex-col flex gap-3 mt-4'>
                            {categories?.map((item, index) => (
                                <div className='flex items-center gap-4'>
                                    <input
                                        type='checkbox'
                                        id={item}
                                        key={index}
                                        name={item}
                                        className='w-4 h-4'
                                        value={item}
                                        onChange={handleClickInputCategory}
                                        checked={categorySelected.length === 0 ? false : categorySelected.find(i => i === item)
                                        }
                                    />
                                    <label className='capitalize text-gray-700' htmlFor={item}>{item}</label>
                                </div>
                            ))}
                        </div>
                    </div>}
                {type === 'input' &&
                    <div onClick={e => e.stopPropagation()}>
                        <div className='p-4 items-center flex justify-between gap-8 border-b'>
                            <span
                                className='whitespace-nowrap'>{`The highest price is ${formatMoney(highestPrice)}VND `}</span>
                            <span className='cursor-pointer underline hover:text-main'
                                onClick={e => {
                                    e.stopPropagation();
                                    setPriceFilter({ from: 0, to: 0 })
                                    changeActiveFilter(null);
                                }}>
                                Reset</span>
                        </div>
                        <div className='flex items-center p-2 gap-2'>
                            <div className='flex items-center gap-2'>
                                <label htmlFor="from">From</label>
                                <input
                                    value={priceFilter[0]}
                                    onChange={e => setPriceFilter(prev => ({ ...prev, from: e.target.value }))}
                                    className='form-input' type="number" id="from" />
                            </div>
                            <div className='flex items-center gap-2'>
                                <label htmlFor="to">To</label>
                                <input
                                    value={priceFilter[1]}
                                    onChange={e => setPriceFilter(prev => ({ ...prev, to: e.target.value }))}
                                    className='form-input' type="number" id="to" />
                            </div>
                        </div>
                    </div>}
            </div>}
        </div >
    )
}

export default memo(FilterProduct)
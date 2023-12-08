import React, { memo, useEffect, useState } from 'react';
import icons from '../ultils/icons';
import { colors } from '../ultils/constants';
import { createSearchParams, useNavigate, useParams } from 'react-router-dom';
// import path from '../ultils/path';
import { apiGetProducts } from '../apis';
import { formatMoney } from '../ultils/helpers';
import useDebounce from '../custom_hook/useDebounce';

const { IoChevronDown } = icons;

const FilterProduct = ({ name, activeClick, changeActiveFilter, type = 'checkbox' }) => {
    //take params from url 
    const { category } = useParams();
    //define navigate 
    const navigate = useNavigate();

    const [priceFilter, setPriceFilter] = useState({
        from: 0,
        to: 0
    })

    //define selected color 
    const [selected, setSelected] = useState([]);

    //define highest price
    const [highestPrice, setHighestPrice] = useState(null);

    //define function handle click input 
    const handleClickInput = (e) => {
        const alreadySelected = selected.find(item => item === e.target.value);
        if (alreadySelected) {
            setSelected(prev => prev.filter(item => item !== e.target.value))
        } else {
            setSelected(prev => [...prev, e.target.value])
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

    //define useEffect for filter by color
    useEffect(() => {
        if (selected.length > 0) {
            navigate({
                pathname: `/${category}`,
                search: createSearchParams({
                    color: selected.join(',')
                }).toString()
            })
        } else {
            navigate(`/${category}`);
        }
    }, [selected])

    //define useEffect for filter by price
    useEffect(() => {
        if (type === 'input') {
            fetchHighestPrice();
        }
    }, [type])

    useEffect(() => {
        if (priceFilter.from > priceFilter.to) {
            alert('From price must be less than to price');
        }
    }, [])

    //define debounce price filter 
    const debouncePriceFrom = useDebounce(priceFilter.from, 1000);
    const debouncePriceTo = useDebounce(priceFilter.to, 1000);
    //define useEffect for filter by price by typing 
    useEffect(() => {
        const data = {};
        if (priceFilter.from > 0) {
            data.from = +priceFilter.from;
        }
        if (priceFilter.to > 0) {
            data.to = +priceFilter.to;
        }
        navigate({
            pathname: `/${category}`,
            search: createSearchParams(data).toString()
        })
    }, [debouncePriceFrom, debouncePriceTo])


    return (
        <div
            className='p-3 cursor-pointer text-gray-600 text-xs border gap-4 relative border-gray-800 flex justify-between items-center'
            onClick={() => changeActiveFilter(name)}>
            <span >{name}</span>
            <IoChevronDown />
            {activeClick === name && <div className='absolute z-10 top-[calc(100%+1px)] left-0 w-fit p-4 border bg-white min-w-[150px] '>
                {type === 'checkbox' &&
                    <div onClick={e => e.stopPropagation()}>
                        <div className='p-4 items-center flex justify-between gap-8 border-b'>
                            <span className='whitespace-nowrap'>{`${selected.length} selected`}</span>
                            <span className='cursor-pointer underline hover:text-main'
                                onClick={e => {
                                    e.stopPropagation();
                                    setSelected([])
                                }}>
                                Reset</span>
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
                                        onChange={handleClickInput}
                                        checked={selected.length === 0 ? false : selected.find(i => i === item)}
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
                                    setPriceFilter({
                                        from: 0,
                                        to: 0
                                    })
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
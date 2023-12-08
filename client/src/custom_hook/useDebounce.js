import React, { useEffect, useState } from 'react'


//expedted: when user type price => call api to get data
//problem of onChange: when user type continuously, it will call api continuously
//resolve: only call api when user cmplete typing 
//guess time to complete typing: 500ms
//attach value of price to 2 vaiables:
// first variable: serving for UI, while type continuously, it will save value of price => render UI
// second variable: used to decide to capp api => using setTimeout => vaiable will be sign after 500ms => call api 

//define custom hook receive 2 params: value and ms
//purpose: return value after ms (mili second to wait for user complete typing and get decision to call api ) 
const useDebounce = (value, ms) => {
    const [debouncedValue, setDebouncedValue] = useState('');

    useEffect(() => {
        // console.log(debouncedValue)
        const setTimeOutId = setTimeout(() => {
            setDebouncedValue(value);
        }, ms);
        return () => {
            clearTimeout(setTimeOutId);
        }
    }, [value, ms])
    return debouncedValue;
}

export default useDebounce


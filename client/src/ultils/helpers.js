import icons from './icons';
const { FaRegStar, FaStar } = icons;

export const createSlug = (str) => {
    return str.toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').split(' ').join('-');
}

export const formatMoney = (number) => {
    return (Math.round(number / 1000) * 1000).toLocaleString();
    // return (+number).toLocaleString('vi-VN');
}

export const renderStarFromNumber = (number, size) => {
    if (!Number(number)) return;
    const stars = [];
    number = Math.round(number);
    if (+number === 0) {
        for (let i = 0; i < 5; i++) {
            stars.push(<FaRegStar color='orange' size={size || 16} />)
        }
    }
    for (let i = 0; i < +number; i++) {
        stars.push(<FaStar color='orange' size={size || 16} />)
    }
    for (let i = 5; i > +number; i--) {
        stars.push(<FaRegStar color='orange' size={size || 16} />)
    }
    return stars;
}

export const secondsToHms = (seconds) => {
    seconds = Number(seconds) / 1000;
    const h = Math.floor(seconds / 3600);
    const m = Math.floor(seconds % 3600 / 60);
    const s = Math.floor(seconds % 3600 % 60);
    return ({ h, m, s });
}

export const validate = (payload, setInvalidFields) => {
    let invalidFields = 0;
    //paylloadformat is array
    const formatPayload = Object.entries(payload)
    // console.log(formatPayload);
    for (let arr of formatPayload) {
        if (arr[1] === '') {
            invalidFields++;
            setInvalidFields(prev => [...prev, { name: arr[0], message: 'This field is required' }]);
        }
    }
    for (let arr of formatPayload) {
        switch (arr[0]) {
            case 'email':
                const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!arr[1].match(regex)) {
                    invalidFields++;
                    setInvalidFields(prev => [...prev, { name: arr[0], message: 'Invalid email' }]);
                }
                break;
            case 'password':
                if (arr[1].length < 6) {
                    invalidFields++;
                    setInvalidFields(prev => [...prev, { name: arr[0], message: 'Password must be at least 6 characters' }]);
                }
                break;
            case 'mobile':
                if (arr[1].length < 10) {
                    invalidFields++;
                    setInvalidFields(prev => [...prev, { name: arr[0], message: 'Password must be at least 6 characters' }]);
                }
                break;
            default:
                break;
        }
    }

    return invalidFields;
}

export const generateRange = (start, end) => {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

export const getBase64 = (file) => {
    if (!file) {
        return Promise.reject(new Error("File is empty or undefined"));
    }

    if (!(file instanceof File)) {
        return Promise.reject(new Error("Invalid file object"));
    }

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

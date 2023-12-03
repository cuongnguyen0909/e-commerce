import icons from './icons';
const { FaRegStar, FaStar } = icons;

export const createSlug = (str) => {
    return str.toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').split(' ').join('-');
}

export const formatMoney = (number) => {
    return (+number).toLocaleString('vi-VN');
}

export const renderStarFromNumber = (number, size) => {
    if (!Number(number)) return;
    const stars = [];
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
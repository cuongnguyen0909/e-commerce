export const createSlug = (str) => {
    return str.toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').split(' ').join('-');
}
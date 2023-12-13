
const path = {
    PUBLIC: '/',
    HOME: '',
    ALL: '*',
    LOGIN: 'login',
    LISTPRODUCT: ':category',
    SHOW_PRODUCT_SEARCH: 'search',
    BLOG: 'blog',
    SERVICE: 'service',
    FAQS: 'faqs',
    DETAIL_PRODUCT__CATEGORY__PID__TITLE: `:category/:pid/:title`,
    FINAL_REGISTER: 'finalregister/:status',
    RESET_PASSWORD: 'resetpassword/:token',
    //Admin
    ADMIN: 'admin',
    DASHBOARD: 'dashboard',
    MANAGE_USER: 'manage-user',
    MANAGE_PRODUCT: 'manage-product',
    MANAGE_ORDER: 'manage-order',
    CREATE_PRODUCT: 'create-product',

    //Member
    MEMBER: 'member',
    PERSONAL: 'personal',

}

export default path;
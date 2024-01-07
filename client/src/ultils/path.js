
const path = {
    PUBLIC: '/',
    HOME: '',
    ALL: '*',
    LOGIN: 'login',
    LISTPRODUCT: ':category',
    PRODUCTS: 'products',
    SHOW_PRODUCT_SEARCH: 'search',
    BLOG: 'blog',
    SERVICE: 'service',
    FAQS: 'faqs',
    DETAIL_PRODUCT__CATEGORY__PID__TITLE: `:category/:pid/:title`,
    FINAL_REGISTER: 'finalregister/:status',
    RESET_PASSWORD: 'resetpassword/:token',
    // DETAIL_CART: 'detail-cart',
    CHECKOUT: 'checkout',

    //Admin
    ADMIN: 'admin',
    DASHBOARD: 'dashboard',
    MANAGE_USER: 'manage-user',
    MANAGE_PRODUCT: 'manage-product',
    MANAGE_ORDER: 'manage-order',
    CREATE_PRODUCT: 'create-product',
    MANAGE_CATEGORY: 'manage_category',

    //Member
    MEMBER: 'member',
    PERSONAL: 'personal',
    MY_CART: 'my-cart',
    WISHLIST: 'wishlist',
    PURCHASE_HISTORY: 'purchase-history',
    CHANGE_PASSWORD: 'change-password',
}

export default path;
import { GrGroup } from "react-icons/gr";
import { MdProductionQuantityLimits } from "react-icons/md";
import { RiProductHuntLine } from "react-icons/ri";
import { RxDashboard } from "react-icons/rx";
import { TbBrandReactNative } from "react-icons/tb";
import path from "./path";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { MdHistory } from "react-icons/md";
import { MdPlaylistAddCheckCircle } from "react-icons/md";
import { FaExchangeAlt } from "react-icons/fa";

export const navigation = [
    {
        id: 1,
        value: 'HOME',
        path: `${path.HOME}`
    },
    {
        id: 2,
        value: 'PRODUCTS',
        path: `${path.PRODUCTS}`
    },
    {
        id: 3,
        value: 'BLOGS',
        path: `${path.BLOG}`
    },
    {
        id: 4,
        value: 'OUR SERVICES',
        path: `${path.SERVICE}`
    },
    {
        id: 5,
        value: 'FAQS',
        path: `${path.FAQS}`
    }
]
export const productExtraInfo = [
    {
        id: 1,
        title: 'Guarantee',
        sub: 'Quality Checked',
    },
    {
        id: 2,
        title: 'Free Shipping   ',
        sub: 'Free On All Products',
    },
    {
        id: 3,
        title: 'Special Gift Cards',
        sub: 'Special Gift Cards',
    },
    {
        id: 4,
        title: 'Free Return',
        sub: 'Within 7 Days',
    },
    {
        id: 5,
        title: 'Consultancy',
        sub: 'Lifetime 24/7/356',
    }
]
export const productInfoTabs = [
    {
        id: 1,
        name: 'DESCRIPTION',
        content: `Technology: No Cellular Connectivity
        Dimensions: 42.6 X 36.5 X 11.4 Mm
        Weight: 45.6 G
        Display: AMOLED 1.6 Inches
        Resolution: 390 X 312
        OS: WatchOS 3.0
        Chipset: Apple S2
        CPU: Dual-Core
        Internal: No
        Camera: No`
    },
    {
        id: 2,
        name: 'WARRANTY',
        content: `WARRANTY INFORMATION
        LIMITED WARRANTIES
        Limited Warranties are non-transferable. The following Limited Warranties are given to the original retail purchaser of the following Ashley Furniture Industries, Inc.Products:
        
        Frames Used In Upholstered and Leather Products
        Limited Lifetime Warranty
        A Limited Lifetime Warranty applies to all frames used in sofas, couches, love seats, upholstered chairs, ottomans, sectionals, and sleepers. Ashley Furniture Industries,Inc. warrants these components to you, the original retail purchaser, to be free from material manufacturing defects.`
    },
    {
        id: 3,
        name: 'DELIVERY',
        content: `PURCHASING & DELIVERY
        Before you make your purchase, it’s helpful to know the measurements of the area you plan to place the furniture. You should also measure any doorways and hallways through which the furniture will pass to get to its final destination.
        Picking up at the store
        Shopify Shop requires that all products are properly inspected BEFORE you take it home to insure there are no surprises. Our team is happy to open all packages and will assist in the inspection process. We will then reseal packages for safe transport. We encourage all customers to bring furniture pads or blankets to protect the items during transport as well as rope or tie downs. Shopify Shop will not be responsible for damage that occurs after leaving the store or during transit. It is the purchaser’s responsibility to make sure the correct items are picked up and in good condition.
        Delivery
        Customers are able to pick the next available delivery day that best fits their schedule. However, to route stops as efficiently as possible, Shopify Shop will provide the time frame. Customers will not be able to choose a time. You will be notified in advance of your scheduled time frame. Please make sure that a responsible adult (18 years or older) will be home at that time.
        In preparation for your delivery, please remove existing furniture, pictures, mirrors, accessories, etc. to prevent damages. Also insure that the area where you would like your furniture placed is clear of any old furniture and any other items that may obstruct the passageway of the delivery team. Shopify Shop will deliver, assemble, and set-up your new furniture purchase and remove all packing materials from your home. Our delivery crews are not permitted to move your existing furniture or other household items. Delivery personnel will attempt to deliver the purchased items in a safe and controlled manner but will not attempt to place furniture if they feel it will result in damage to the product or your home. Delivery personnel are unable to remove doors, hoist furniture or carry furniture up more than 3 flights of stairs. An elevator must be available for deliveries to the 4th floor and above.`
    },
    {
        id: 4,
        name: 'PAYMENT',
        content: `PAYMENT
        
        Customers are able to pick the next available delivery day that best fits their schedule. However, to route stops as efficiently as possible, Shopify Shop will provide the time frame. Customers will not be able to choose a time. You will be notified in advance of your scheduled time frame. Please make sure that a responsible adult (18 years or older) will be home at that time.
        In preparation for your delivery, please remove existing furniture, pictures, mirrors, accessories, etc. to prevent damages. Also insure that the area where you would like your furniture placed is clear of any old furniture and any other items that may obstruct the passageway of the delivery team. Shopify Shop will deliver, assemble, and set-up your new furniture purchase and remove all packing materials from your home. Our delivery crews are not permitted to move your existing furniture or other household items. Delivery personnel will attempt to deliver the purchased items in a safe and controlled manner but will not attempt to place furniture if they feel it will result in damage to the product or your home. Delivery personnel are unable to remove doors, hoist furniture or carry furniture up more than 3 flights of stairs. An elevator must be available for deliveries to the 4th floor and above.`
    }
]

export const colors = [
    "black",
    "gray",
    "white",
    "red",
    "yellow",
    "green",
    "blue",
    "purple",
    "pink",
    "brown",
    "orange",
    "gold",
    "silver",
    "bronze",
]

export const sorts = [
    {
        id: 1,
        value: '-sold',
        text: 'Best Selling'
    },
    {
        id: 2,
        value: 'title',
        text: 'Alphabetically, A-Z'
    },
    {
        id: 3,
        value: '-title',
        text: 'Alphabetically, Z-A'
    },
    {
        id: 4,
        value: 'price',
        text: 'Price, low to high'
    },
    {
        id: 5,
        value: '-price',
        text: 'Price, high to low'
    },
    {
        id: 6,
        value: '-created',
        text: 'Date, new to old'
    },
    {
        id: 7,
        value: 'created',
        text: 'Date, old to new'
    },
]
export const reviewOption = [
    { id: 1, text: 'Terrible' },
    { id: 2, text: 'Bad' },
    { id: 3, text: 'Neutral' },
    { id: 4, text: 'Good' },
    { id: 5, text: 'Perfect' },
]

export const adminSideBar = [
    {
        id: 1, type: 'SINGLE', text: 'Dashboard', path: `/${path.ADMIN}/${path.DASHBOARD}`, icon: <RxDashboard />
    },
    {
        id: 2, type: 'SINGLE', text: 'Manage User', path: `/${path.ADMIN}/${path.MANAGE_USER}`, icon: <GrGroup />
    },
    {
        id: 3,
        type: 'PARENT',
        text: 'Product',
        icon: <RiProductHuntLine />,
        subMenu: [
            {
                text: 'Create Product',
                path: `/${path.ADMIN}/${path.CREATE_PRODUCT}`,
            },
            {
                text: 'Manage Product',
                path: `/${path.ADMIN}/${path.MANAGE_PRODUCT}`,
            }
        ]
    },
    ,
    {
        id: 4,
        type: 'SINGLE',
        text: 'Manage Category',
        path: `/${path.ADMIN}/${path.MANAGE_CATEGORY}`,
        icon: <TbBrandReactNative />
    },
    {
        id: 5,
        type: 'SINGLE',
        text: 'Manage Order',
        path: `/${path.ADMIN}/${path.MANAGE_ORDER}`,
        icon: <MdProductionQuantityLimits />
    },
]
export const memberSideBar = [
    {
        id: 1, type: 'SINGLE', text: 'Profile', path: `/${path.MEMBER}/${path.PERSONAL}`, icon: <RxDashboard size={20} />
    },
    {
        id: 2, type: 'SINGLE', text: 'My cart', path: `/${path.MEMBER}/${path.MY_CART}`, icon: <AiOutlineShoppingCart size={20} />
    },
    {
        id: 3, type: 'SINGLE', text: 'Purchase history', path: `/${path.MEMBER}/${path.PURCHASE_HISTORY}`, icon: <MdHistory size={24} />
    },
    {
        id: 4, type: 'SINGLE', text: 'Wishlist', path: `/${path.MEMBER}/${path.WISHLIST}`, icon: <MdPlaylistAddCheckCircle size={24} />
    },
    {
        id: 5, type: 'SINGLE', text: 'Change password', path: `/${path.MEMBER}/${path.CHANGE_PASSWORD}`, icon: <FaExchangeAlt size={20} />
    },
]

export const roles = [
    {
        code: 99, value: 'Member'
    },
    {
        code: 2002, value: 'Admin'
    }
]

export const blockUser = [
    {
        code: true, value: 'Blocked'
    },
    {
        code: false, value: 'Active'
    }
]

export const statusOrder = [
    { label: 'Processing', value: 'Processing' },
    { label: 'Cancelled', value: 'Cancelled' },
    { label: 'Succeeded', value: 'Succeeded' }
]

export const paymentMethod = [
    {
        code: 'COD', value: 'Cash On Delivery (COD)'
    },
    {
        code: 'PayPal', value: 'PayPal'
    }
]
import { createSlice, current } from '@reduxjs/toolkit';
import * as actions from '../user/userAction';

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        isLoggedIn: false,
        current: null,
        token: null,
        isLoading: false,
        message: '',
        currentCart: []
    },
    reducers: {
        login: (state, action) => {
            state.isLoggedIn = action.payload.isLoggedIn;
            state.current = action.payload.userData;
            state.token = action.payload.token;
        },
        logout: (state, action) => {
            state.isLoggedIn = false;
            state.token = null;
            state.current = null;
            state.message = '';
            state.isLoading = false;
        },
        clearMessage: (state, action) => {
            state.message = '';
        },
        updateCart: (state, action) => {
            // console.log(action);
            const { pid, color, quantity } = action.payload;
            const updateCart = JSON.parse(JSON.stringify((state.currentCart)));
            const completeCart = updateCart.map((item) => {
                if (item.product?._id === pid && item.color === color) {
                    return { ...item, quantity: quantity }
                } else {
                    return item;
                }
            });
            state.currentCart = completeCart;
        }
    },
    extraReducers: (builder) => {
        // start action(promise pending)
        builder.addCase(actions.getCurrent.pending, (state) => {
            state.isLoading = true;
        });

        builder.addCase(actions.getCurrent.fulfilled, (state, action) => {
            // console.log(action);
            state.isLoading = false;
            state.current = action.payload;//action.payload chinh la response.user ben userSlice.js
            state.isLoggedIn = true;
            state.currentCart = action.payload.cart;
        })

        builder.addCase(actions.getCurrent.rejected, (state, action) => {
            state.isLoading = false;
            state.current = null;
            state.isLoggedIn = false;
            state.token = null;
            state.message = 'Login session has expired. Please log in again.'
        })
    }
})
export const { login, logout, clearMessage, updateCart } = userSlice.actions; /// nam trong reducers
export default userSlice.reducer;
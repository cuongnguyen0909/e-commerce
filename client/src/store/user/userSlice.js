import { createSlice } from '@reduxjs/toolkit';
import * as actions from '../user/userAction';

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        isLoggedIn: false,
        current: null,
        token: null,
        isLoading: false
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
        })

        builder.addCase(actions.getCurrent.rejected, (state, action) => {
            state.isLoading = false;
            state.current = null;
        })
    }
})
export const { login, logout } = userSlice.actions; /// nam trong reducers
export default userSlice.reducer;
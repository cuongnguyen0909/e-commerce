import { createSlice } from '@reduxjs/toolkit';
import * as actions from './appAction';

export const appSlice = createSlice({
    name: 'app',
    initialState: {
        categories: null,
        isLoading: false
    },
    reducers: {
        // logout: (state) => {
        //     state.isLoading = false;
        // }
    },
    extraReducers: (builder) => {
        // start action(promise pending)
        builder.addCase(actions.getCategories.pending, (state) => {
            state.isLoading = true;
        });

        builder.addCase(actions.getCategories.fulfilled, (state, action) => {
            // console.log(action);
            state.isLoading = false;
            state.categories = action.payload;
            // console.log(action.payload);
        })

        builder.addCase(actions.getCategories.rejected, (state, action) => {
            state.isLoading = false;
            state.errorMesaage = action.payload?.message;
        })
    }
})
// export const { } = appSlice.actions; /// nam trong reducers
export default appSlice.reducer;
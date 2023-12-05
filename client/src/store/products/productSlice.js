import { createSlice } from '@reduxjs/toolkit';
import * as actions from './productAction';

export const productSlice = createSlice({
    name: 'product',
    initialState: {
        newProduct: null,
        errorMesaage: ''
    },
    reducers: {
        // logout: (state) => {
        //     state.isLoading = false;
        // }
    },
    extraReducers: (builder) => {
        // start action(promise pending)
        builder.addCase(actions.getNewProduct.pending, (state) => {
            state.isLoading = true;
        });

        builder.addCase(actions.getNewProduct.fulfilled, (state, action) => {
            // console.log(action);
            state.isLoading = false;
            state.newProduct = action.payload;
        })

        builder.addCase(actions.getNewProduct.rejected, (state, action) => {
            state.isLoading = false;
            state.errorMesaage = action.payload.message;
        })
    }
})
// export const { } = appSlice.actions; /// nam trong reducers
export default productSlice.reducer;
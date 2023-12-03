import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        isLoggedIn: false,
        current: null,
        token: null,
    },
    reducers: {
        register: (state, action) => {
            state.isLoggedIn = action.payload.isLoggedIn;
            state.current = action.payload.userData;
            state.token = action.payload.token;
        }
    },
    // extraReducers: (builder) => {
    //     // start action(promise pending)
    //     builder.addCase(actions.getCategories.pending, (state) => {
    //         state.isLoading = true;
    //     });

    //     builder.addCase(actions.getCategories.fulfilled, (state, action) => {
    //         // console.log(action);
    //         state.isLoading = false;
    //         state.categories = action.payload;
    //     })

    //     builder.addCase(actions.getCategories.rejected, (state, action) => {
    //         state.isLoading = false;
    //         state.errorMesaage = action.payload.message;
    //     })
    // }
})
export const { register} = userSlice.actions; /// nam trong reducers
export default userSlice.reducer;
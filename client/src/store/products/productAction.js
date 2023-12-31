import { createAsyncThunk } from "@reduxjs/toolkit";
import * as apis from '../../apis';


export const getNewProduct = createAsyncThunk('product/newProducts', async (data, { rejectWithValue }) => {
    const response = await apis.apiGetProducts({ sort: '-createdAt' });
    // console.log(response);
    if (!response.status) {
        return rejectWithValue(response);
    }
    return response.products;
})


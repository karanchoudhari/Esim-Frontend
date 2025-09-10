import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import axios from "axios";
import AxiosInstance from "../../Axiosinstance";

export const fetchtodo = createAsyncThunk('fetchtodo', async () => {
    try {
        const res = await AxiosInstance.get('/gettodo')
        const mila = await res.data;
        // console.log('thiss', mila);
        return mila.data; // pass data to fulfilled
    } catch (error) {
        console.log(error);
        throw error; // ensures rejected case is triggered
    }
});

const Todoslice = createSlice({
    name: 'todo',
    initialState: {
        isLoading: false,
        data: [],     // better than null for list data
        isError: false,
    },
    extraReducers: (builder) => {
        builder.addCase(fetchtodo.pending, (state) => {
            state.isLoading = true;
            state.isError = false;
        });
        builder.addCase(fetchtodo.fulfilled, (state, action) => {
            state.isLoading = false;
            state.data = action.payload;
        });
        builder.addCase(fetchtodo.rejected, (state, action) => {
            console.log('Error', action.error);
            state.isError = true;
            state.isLoading = false;
        });
    },
});

export default Todoslice.reducer;

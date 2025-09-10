import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import AxiosInstance from "../../Axiosinstance";


export const Deletetodo = createAsyncThunk('deletetodo',async(id)=>{
    try {
        const res = await AxiosInstance.delete(`/deletetodo/${id}`);
        return res.data;
    } catch (error) {
        console.log('here are the issue ',error)
    }
})

const deletetodoslice = createSlice({
    name:'deletetodo',
    initialState:{
        isLoading:false,
        Data:null,
        isError:false,
    },
    extraReducers:(builder)=>{
        builder.addCase(Deletetodo.pending,(state)=>{
            state.Data=null,
            state.isError=false,
            state.isLoading=true
        })
        builder.addCase(Deletetodo.fulfilled,(state,action)=>{
            state.Data=action.payload,
            state.isError=false,
            state.isLoading=false
        })
        builder.addCase(Deletetodo.rejected,(state,action)=>{
            state.Data=action.error,
            state.isError=true,
            state.isLoading=false
        })
    }
})

export default deletetodoslice.reducer;
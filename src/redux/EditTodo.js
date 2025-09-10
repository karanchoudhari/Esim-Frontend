import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import AxiosInstance from "../../Axiosinstance";

export const edittodo = createAsyncThunk('edittodo',async ({id,title,description})=>{
    try {
        const res = await AxiosInstance.put(`/edittodo/${id}`,{title,description})
        return res.data;
    } catch (error) {
        console.log('eroor',error)
    }
})

const edittodoslice = createSlice({
    name:'edittodoslice',
    initialState:{
        isLoading:false,
        Data:null,
        isError:false,
    },
    extraReducers:(builder)=>{
        builder.addCase(edittodo.pending,(state)=>{
            state.Data=false,
            state.isLoading=true,
            state.isError=false
        })
        builder.addCase(edittodo.fulfilled,(state,action)=>{
            state.Data = action.payload,
            state.isLoading= false,
            state.isError= false
        })
        builder.addCase(edittodo.rejected,(state,action)=>{
            state.isError= action.error,
            state.isLoading=false,
            state.Data=null
        })
    }
})



export default edittodoslice.reducer;
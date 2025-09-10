import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import AxiosInstance from "../../Axiosinstance";

export const CreateTodo = createAsyncThunk('CreateTodo', async (payload, thunkAPI) => {
  try {
    const res = await AxiosInstance.post('/createtodo', payload);
    return res.data.data;   // backend se "data" field mil raha hai
  } catch (error) {
    console.log('getting error', error);
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

const CreateTodoslice = createSlice({
  name: 'CreateTodo',
  initialState: {
    isLoading: false,
    data: null,
    isError: false,
    errorMessage: null
  },
  extraReducers: (builder) => {
    builder.addCase(CreateTodo.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.errorMessage = null;
    });
    builder.addCase(CreateTodo.fulfilled, (state, action) => {
      state.isLoading = false;
      state.data = action.payload;
      state.isError = false;
    });
    builder.addCase(CreateTodo.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.errorMessage = action.payload;
    });
  }
});

export default CreateTodoslice.reducer;

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import AxiosInstance from '../../Axiosinstance';

export const requestESIM = createAsyncThunk(
  'esim/request',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await AxiosInstance.post('/esim/request', 
        {},
        {
          headers: { 
            'Authorization': `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const activeEsim = createAsyncThunk(
  'esim/active',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await AxiosInstance.get('/esim/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const esimSlice = createSlice({
  name: 'esim',
  initialState: {
    isLoading: false,
    error: null,
    esim: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // eSIM request
      .addCase(requestESIM.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(requestESIM.fulfilled, (state, action) => {
        state.isLoading = false;
        state.esim = action.payload.esim;
        state.error = null;
      })
      .addCase(requestESIM.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Active eSIM fetch
      .addCase(activeEsim.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(activeEsim.fulfilled, (state, action) => {
        state.isLoading = false;
        state.esim = action.payload;
        state.error = null;
      })
      .addCase(activeEsim.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError } = esimSlice.actions;
export default esimSlice.reducer;
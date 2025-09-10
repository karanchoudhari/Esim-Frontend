import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// import axios from 'axios';
import AxiosInstance from '../../Axiosinstance';

export const uploadKYC = createAsyncThunk(
  'upload',
  async (formData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await AxiosInstance.post('/kyc/upload', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const checkKYCStatus = createAsyncThunk(
  'status',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await AxiosInstance.get('/kyc/status', {
        headers: { 
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const kycSlice = createSlice({
  name: 'kyc',
  initialState: {
    isLoading: false,
    error: null,
    kycStatus: 'approved',
    kycDetails: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadKYC.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(uploadKYC.fulfilled, (state, action) => {
        state.isLoading = false;
        state.kycStatus = action.payload.kycStatus;
      })
      .addCase(uploadKYC.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(checkKYCStatus.fulfilled, (state, action) => {
        state.kycStatus = action.payload.kycStatus;
        state.kycDetails = action.payload.kycDetails;
      });
  }
});

export const { clearError } = kycSlice.actions;
export default kycSlice.reducer;
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import AxiosInstance from "../../Axiosinstance";

export const SignIn = createAsyncThunk('auth/signup', async (userdata) => {
    try {
        const res = await AxiosInstance.post('/user/createuser', userdata);
        return res.data;
    } catch (error) {
        console.log('getting issue in creating user', error);
        throw error;
    }
})

export const LoginUser = createAsyncThunk('auth/login', async (userdata) => {
    try {
        const res = await AxiosInstance.post('/user/loginuser', userdata);
        return res.data;
    } catch (error) {
        console.log('getting issue in login', error);
        throw error;
    }
})

export const ForgotPassword = createAsyncThunk('auth/forgotPassword', async (email, { rejectWithValue }) => {
    try {
        const res = await AxiosInstance.post('/user/forgot-password', { email });
        return res.data;
    } catch (error) {
        console.log('Error in forgot password', error);
        return rejectWithValue(error.response?.data || { 
            message: 'Network error. Please try again.' 
        });
    }
})



export const ResetPassword = createAsyncThunk('auth/resetPassword', async ({ token, password }, { rejectWithValue }) => {
  try {
    const res = await AxiosInstance.post('/user/reset-password', { token, password });
    return res.data;
  } catch (error) {
    console.log('Error in reset password', error);
    return rejectWithValue(error.response?.data || { 
      message: 'Error resetting password. Please try again.' 
    });
  }
})

const Authslice = createSlice({
    name: 'Auth',
    initialState: {
        isLoading: false,
        isError: false,
        User: null,
        forgotPasswordStatus: 'idle', // 'idle', 'loading', 'success', 'error'
        forgotPasswordMessage: '',
        resetPasswordStatus: 'idle',
         resetPasswordMessage: ''    // 'idle', 'loading', 'success', 'error'
    },
    reducers: {
        clearError: (state) => {
            state.isError = false;
        },
        logout: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.User = null;
            localStorage.removeItem("token"); // Ensure token is removed
        },
        resetForgotPasswordStatus: (state) => {
            state.forgotPasswordStatus = 'idle';
            state.forgotPasswordMessage = '';
        },
        resetResetPasswordStatus: (state) => {
            state.resetPasswordStatus = 'idle';
        }
    },
    extraReducers: (builder) => {
        builder
            // Signup cases
            .addCase(SignIn.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.User = null;
            })
            .addCase(SignIn.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.User = action.payload.data || action.payload;
            })
            .addCase(SignIn.rejected, (state) => {
                state.isLoading = false;
                state.isError = true;
                state.User = null;
            })
            // Login cases
            .addCase(LoginUser.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(LoginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.User = action.payload.data || action.payload;
                // Store token
                const token = action.payload.data?.token || action.payload.token;
                if (token) {
                    localStorage.setItem("token", token);
                }
            })
            .addCase(LoginUser.rejected, (state) => {
                state.isLoading = false;
                state.isError = true;
                state.User = null;
            })
            // Forgot Password cases
            .addCase(ForgotPassword.pending, (state) => {
                state.forgotPasswordStatus = 'loading';
                state.forgotPasswordMessage = '';
            })
            .addCase(ForgotPassword.fulfilled, (state, action) => {
                state.forgotPasswordStatus = 'success';
                state.forgotPasswordMessage = action.payload.message;
            })
            .addCase(ForgotPassword.rejected, (state, action) => {
                state.forgotPasswordStatus = 'error';
                state.forgotPasswordMessage = action.payload?.message || 'An error occurred';
            })
            // Reset Password cases
         // Reset Password cases
            .addCase(ResetPassword.pending, (state) => {
            state.resetPasswordStatus = 'loading';
            state.resetPasswordMessage = '';
            })
            .addCase(ResetPassword.fulfilled, (state, action) => {
            state.resetPasswordStatus = 'success';
            state.resetPasswordMessage = action.payload.message;
            })
            .addCase(ResetPassword.rejected, (state, action) => {
            state.resetPasswordStatus = 'error';
            state.resetPasswordMessage = action.payload?.message || 'An error occurred';
            });
    }
})

export const { clearError, logout, resetForgotPasswordStatus, resetResetPasswordStatus } = Authslice.actions;
export default Authslice.reducer;
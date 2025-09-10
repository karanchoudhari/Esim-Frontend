import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import AxiosInstance from "../../Axiosinstance";

export const loginUser = createAsyncThunk(
  "login",
  async (userdata, { rejectWithValue }) => {
    try {
      const res = await AxiosInstance.post("/user/loginuser", userdata);
      return res.data; // ye wahi hoga jo backend se milta hai
    } catch (error) {
      console.log("Login error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || { message: "Login failed" });
    }
  }
);

// 🔹 Slice
const loginSlice = createSlice({
  name: "login",
  initialState: {
    isLoading: false,
    isError: false,
    User: null,
    errorMessage: null,
  },
//   reducers: {
//     logout: (state) => {
//       state.User = null;
//       localStorage.removeItem("token");
//     },
//   },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;

        // response me "data" aur "token" ka dhyan rakho
        state.User = action.payload.data || action.payload;

        // Token store karna zaroori hai
        const token =
          action.payload.data?.token || action.payload.token || null;
        if (token) {
          localStorage.setItem("token", token);
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.User = null;
        state.errorMessage = action.payload?.message || "Login failed!";
      });
  },
});

// export const { logout } = loginSlice.actions;
export default loginSlice.reducer;

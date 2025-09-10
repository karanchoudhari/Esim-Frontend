import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from "./Createuser"; // Single auth slice
import kycSlice from "./kycSlice";
import esimSlice from "./esimSlice";

export const store = configureStore({
  reducer: {
    Auth: AuthSlice, // Only one auth reducer
    kyc: kycSlice,
    esim: esimSlice,
  }
});
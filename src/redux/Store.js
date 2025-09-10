import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from "./Createuser.js"; // exact filename
import kycSlice from "./KycSlice.js";    // exact casing
import esimSlice from "./esimSlice.js";  // exact filename



export const store = configureStore({
  reducer: {
    Auth: AuthSlice, // Only one auth reducer
    kyc: kycSlice,
    esim: esimSlice,
  }
});
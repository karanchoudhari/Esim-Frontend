import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import "./App.css";
import Signup from "./components/Auth/Signup";
import Home from "./components/Dashboard/Home";
import Welcome from "./components/Auth/Welcome";
import Login from "./components/Auth/Login";
import KYCForm from "./components/KYC/KYCForm";
import ESIMRequest from "./components/eSIM/ESIMRequest";
import Status from "./components/eSIM/Status";
import AdminLogin from "./components/Admin/AdminLogin";
import AdminDashboard from "./components/Admin/AdminDashboard";
import Navbar from "./components/Common/Navbar";
import ForgotPasswordPage from "./components/ForgetPass/ForgotPasswordPage"
import ResetPasswordPage from "./components/ForgetPass/ResetPasswordPage"
import { LoginUser } from "./redux/Createuser";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if user has token in localStorage on app load
    const token = localStorage.getItem("token");
    if (token) {
      // Verify token and get user data
      const verifyToken = async () => {
        try {
          const response = await fetch(
            "https://esim-backend.vercel.app/api/v1/user/verify",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.ok) {
            const userData = await response.json();
            dispatch(LoginUser.fulfilled({ data: userData }));
          } else {
            localStorage.removeItem("token");
          }
        } catch (error) {
          console.error("Token verification failed:", error);
          localStorage.removeItem("token");
        }
      };

      verifyToken();
    }
  }, [dispatch]);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/kyc" element={<KYCForm />} />
        <Route path="/esimrequest" element={<ESIMRequest />} />
        <Route path="/status" element={<Status />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </>
  );
}

export default App;

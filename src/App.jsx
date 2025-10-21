import { Routes, Route, useLocation } from "react-router-dom";
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
import ForgotPasswordPage from "./components/ForgetPass/ForgotPasswordPage";
import ResetPasswordPage from "./components/ForgetPass/ResetPasswordPage";
import { LoginUser } from "./redux/Createuser";

// Socket Context + Chat Widget
import { SocketProvider } from "./context/SocketContext";
import ChatWidget from "./components/ChatWidget/ChatWidget";
import BackToTop from "./components/Common/BackToTop";
import AxiosInstance from "../Axiosinstance";

function App() {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const verifyToken = async () => {
        try {
          // const response = await AxiosInstance.get(
            const response = await fetch(
              // "https://esim-backend-lmen.onrender.com/api/v1/user/verify",
              "https://esim-backend-production-031b.up.railway.app/api/v1/user/verify",
              // "https://esim-backend-production-6610.up.railway.app/api/v1/user/verify",
            // "http://localhost:4000/api/v1/user/verify",
            {
              headers: { Authorization: `Bearer ${token}` },
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

  // Check if current path is an admin route
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <SocketProvider>
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

      <BackToTop/>
      {/* Chat Widget bottom-right me mount hoga, but not on admin routes */}
      {!isAdminRoute && <ChatWidget />}
    </SocketProvider>
  );
}

export default App;

// import { Routes, Route } from "react-router-dom";
// import { useEffect } from "react";
// import { useDispatch } from "react-redux";
// import "./App.css";
// import Signup from "./components/Auth/Signup";
// import Home from "./components/Dashboard/Home";
// import Welcome from "./components/Auth/Welcome";
// import Login from "./components/Auth/Login";
// import KYCForm from "./components/KYC/KYCForm";
// import ESIMRequest from "./components/eSIM/ESIMRequest";
// import Status from "./components/eSIM/Status";
// import AdminLogin from "./components/Admin/AdminLogin";
// import AdminDashboard from "./components/Admin/AdminDashboard";
// import Navbar from "./components/Common/Navbar";
// import ForgotPasswordPage from "./components/ForgetPass/ForgotPasswordPage"
// import ResetPasswordPage from "./components/ForgetPass/ResetPasswordPage"
// import { LoginUser } from "./redux/Createuser";

// function App() {
//   const dispatch = useDispatch();

//   useEffect(() => {
//     // Check if user has token in localStorage on app load
//     const token = localStorage.getItem("token");
//     if (token) {
//       // Verify token and get user data
//       const verifyToken = async () => {
//         try {
//           const response = await fetch(
//             // "https://esim-backend-lmen.onrender.com/api/v1/user/verify",
//             "http://localhost:4000/api/v1/user/verify",
//             {
//               headers: {
//                 Authorization: `Bearer ${token}`,
//               },
//             }
//           );

//           if (response.ok) {
//             const userData = await response.json();
//             dispatch(LoginUser.fulfilled({ data: userData }));
//           } else {
//             localStorage.removeItem("token");
//           }
//         } catch (error) {
//           console.error("Token verification failed:", error);
//           localStorage.removeItem("token");
//         }
//       };

//       verifyToken();
//     }
//   }, [dispatch]);

//   return (
//     <>
//       <Navbar />
//       <Routes>
//         <Route path="/" element={<Welcome />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/forgot-password" element={<ForgotPasswordPage />} />
//         <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
//         <Route path="/home" element={<Home />} />
//         <Route path="/kyc" element={<KYCForm />} />
//         <Route path="/esimrequest" element={<ESIMRequest />} />
//         <Route path="/status" element={<Status />} />
//         <Route path="/admin/login" element={<AdminLogin />} />
//         <Route path="/admin/dashboard" element={<AdminDashboard />} />
//       </Routes>
//     </>
//   );
// }

// export default App;

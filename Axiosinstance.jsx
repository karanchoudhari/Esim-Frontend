// import axios from 'axios';


// // Default URLs
// const LOCAL_URL = "http://localhost:4000/api/v1";
// const PROD_URL = "https://esim-backend-lmen.onrender.com/api/v1";

// // Final base URL priority
// const baseURL =
//   import.meta.env.VITE_API_BASE_URL ||       // 1️⃣ env se lo
//   (import.meta.env.PROD ? PROD_URL : LOCAL_URL); // 2️⃣ agar prod hai to vercel, warna local

// const AxiosInstance = axios.create({
//   baseURL: baseURL,
// });

// // Add authorization header automatically
// AxiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// export default AxiosInstance;

import axios from 'axios';

const AxiosInstance = axios.create({
  // baseURL: 'http://localhost:4000/api/v1'
  baseURL: 'https://esim-backend-lmen.onrender.com/api/v1'
  // baseURL: 'https://esim-backend-production-6610.up.railway.app/api/v1'
});

// Add authorization header automatically
AxiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default AxiosInstance;
import axios from 'axios';

const AxiosInstance = axios.create({
  baseURL: 'http://localhost:4000/api/v1'
});

// Add authorization header automatically
AxiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    // console.log('Axios sending token:', token); // Debug
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
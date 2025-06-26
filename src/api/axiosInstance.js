import axios from 'axios';
import ENDPOINTS from './endpoints';

const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({ baseURL });

// 🔐 Interceptor REQUEST: adaugă tokenul din localStorage
axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// 🔁 Interceptor RESPONSE: încearcă reîmprospătarea tokenului dacă expiră
axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // Rețea căzută sau server indisponibil
    if (!error.response) {
      console.error('❌ Eroare rețea sau server indisponibil:', error.message);
      return Promise.reject(error);
    }

    const isUnauthorized =
      error.response.status === 401 &&
      !originalRequest._isRetry &&
      !originalRequest.url.includes(ENDPOINTS.auth.refreshToken);

    if (isUnauthorized) {
      originalRequest._isRetry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('Refresh token lipsește');

        const { data } = await axios.post(
          ENDPOINTS.auth.refreshToken,
          { refreshToken },
          { baseURL } // Ne asigurăm că se folosește același baseURL
        );

        const newToken = data.token;
        if (!newToken) throw new Error('Token nou lipsă în răspuns');

        localStorage.setItem('accessToken', newToken);

        // Actualizăm tokenul pentru requestul original
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${newToken}`;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('🔁 Token refresh eșuat:', refreshError.message);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

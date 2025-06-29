import axios from 'axios';
import ENDPOINTS from './endpoints';

const baseURL =
  process.env.REACT_APP_API_URL || 'https://task-pro-backend-5kph.onrender.com';

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// 🔐 Interceptor REQUEST — Adaugă token din localStorage (dacă există)
axiosInstance.interceptors.request.use(
  config => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// 🔁 Interceptor RESPONSE — Reînnoiește tokenul automat la 401
axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // 🔌 Fără răspuns (server picat, offline, etc.)
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
        if (!refreshToken) throw new Error('❌ Refresh token lipsește');

        const { data } = await axios.post(
          `${baseURL}${ENDPOINTS.auth.refreshToken}`,
          { refreshToken },
          { withCredentials: true }
        );

        const newToken = data.token;
        if (!newToken) throw new Error('❌ Token nou lipsă în răspuns');

        localStorage.setItem('accessToken', newToken);

        // Actualizăm tokenul pe requestul inițial și pe instanță
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${newToken}`;

        return axiosInstance(originalRequest); // retrimitere
      } catch (refreshError) {
        console.error('🔁 Token refresh eșuat:', refreshError.message);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
